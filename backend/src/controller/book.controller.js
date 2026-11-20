import { Book, Chapter } from '../models/Book.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// CREATE DIARY (The living diary channel/journal)
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    subtitle,
    chapters = [],
    accessType = 'free',
    plans,
    isPremium = false,
    price = 0,
    mood = 'Daily Life',
    category = 'Daily Vlog',
    freePreviewEntries = 2,
    coverImage = '',
    upiId = '',
  } = req.body;

  if (!title || !author) {
    throw new ApiError(400, 'Title and author name are required');
  }

  // If initial entries are provided, save them, or start with a first welcome day entry
  let chapterIds = [];
  if (Array.isArray(chapters) && chapters.length > 0) {
    const chapterDocs = await Promise.all(
      chapters.map(async (ch, index) => {
        return Chapter.create({
          title: ch.title || `Day ${index + 1}`,
          description: ch.description || '',
          content: ch.content || '',
          date: ch.date ? new Date(ch.date) : new Date(),
          mood: ch.mood || mood,
          weather: ch.weather || 'Sunny',
          timeOfDay: ch.timeOfDay || 'Evening',
          location: ch.location || '',
          photos: Array.isArray(ch.photos) ? ch.photos : [],
          videos: Array.isArray(ch.videos) ? ch.videos : [],
        });
      })
    );
    chapterIds = chapterDocs.map((c) => c._id);
  } else {
    // Start with a clean first entry
    const firstEntry = await Chapter.create({
      title: 'Day 1: Beginning the Journey',
      description: 'Starting my personal life diary stream.',
      content:
        'Today I decided to start documenting my daily life. Here is to raw, authentic moments.',
      date: new Date(),
      mood: mood,
      weather: 'Sunny',
      timeOfDay: 'Day',
    });
    chapterIds = [firstEntry._id];
  }

  const isPaid = accessType === 'paid' || Boolean(isPremium);
  const defaultPlans = {
    weekly: {
      enabled: plans?.weekly?.enabled ?? true,
      price: Number(plans?.weekly?.price) || 49,
    },
    monthly: {
      enabled: plans?.monthly?.enabled ?? true,
      price: Number(plans?.monthly?.price) || Number(price) || 149,
    },
    annual: {
      enabled: plans?.annual?.enabled ?? true,
      price: Number(plans?.annual?.price) || 899,
    },
  };

  const parsedPrice = isPaid ? defaultPlans.monthly.price : 0;

  const diary = await Book.create({
    userId: req.user._id,
    title,
    author,
    subtitle: subtitle || '',
    coverImage: coverImage?.trim() || '',
    upiId: upiId?.trim() || req.user.payoutSettings?.upiId || '',
    chapters: chapterIds,
    mood,
    category,
    accessType: isPaid ? 'paid' : 'free',
    plans: defaultPlans,
    isPremium: isPaid,
    price: parsedPrice,
    freePreviewEntries: Number(freePreviewEntries) || 2,
    isOngoing: true,
    status: 'published',
  });

  const populated = await Book.findById(diary._id).populate('chapters');

  return res.status(201).json(new ApiResponse(201, populated, 'Life diary created successfully'));
});

// GET USER'S OWN DIARIES
const getBooks = asyncHandler(async (req, res) => {
  const diaries = await Book.find({ userId: req.user?._id })
    .populate('chapters')
    .sort({ updatedAt: -1 });

  return res.status(200).json(new ApiResponse(200, diaries, 'Diaries fetched successfully'));
});

// EXPLORE / PUBLIC FEED (Browse creators' ongoing diaries)
const getPublicDiaries = asyncHandler(async (req, res) => {
  const { category, search, mood } = req.query;
  const filter = { status: 'published' };

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (mood && mood !== 'All') {
    filter.mood = mood;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { subtitle: { $regex: search, $options: 'i' } },
    ];
  }

  const diaries = await Book.find(filter)
    .populate('chapters', 'title date mood weather location photos videos')
    .sort({ updatedAt: -1 })
    .limit(50);

  const currentUserId = req.user?._id ? req.user._id.toString() : null;

  const result = diaries.map((d) => {
    const isOwner = currentUserId && d.userId.toString() === currentUserId;
    const isPurchased =
      currentUserId && d.purchasedBy && d.purchasedBy.some((id) => id.toString() === currentUserId);
    const isFree = d.accessType === 'free' || (!d.isPremium && (d.price || 0) <= 0);
    const isUnlocked = isOwner || isPurchased || isFree;

    return {
      _id: d._id,
      title: d.title,
      subtitle: d.subtitle,
      author: d.author,
      coverImage: d.coverImage,
      mood: d.mood,
      category: d.category,
      accessType: d.accessType || (d.isPremium ? 'paid' : 'free'),
      plans: d.plans,
      isPremium: d.isPremium,
      price: d.price,
      freePreviewEntries: d.freePreviewEntries,
      entriesCount: d.chapters?.length || 0,
      latestEntryDate: d.chapters?.[d.chapters.length - 1]?.date || d.updatedAt,
      createdAt: d.createdAt,
      isOwner,
      isUnlocked,
    };
  });

  return res.status(200).json(new ApiResponse(200, result, 'Public feed fetched successfully'));
});

// GET DIARY BY ID (With Living Entries, Photos, Videos & Paywall logic)
const getBookById = asyncHandler(async (req, res) => {
  const diary = await Book.findById(req.params.id).populate('chapters');

  if (!diary) {
    throw new ApiError(404, 'Diary vlog not found');
  }

  Book.findByIdAndUpdate(diary._id, { $inc: { viewsCount: 1 } }).exec();

  const currentUserId = req.user?._id ? req.user._id.toString() : null;
  const isOwner = currentUserId && diary.userId.toString() === currentUserId;

  let activeSubscription = null;
  let isPurchased = false;

  if (currentUserId) {
    const user = await User.findById(currentUserId);
    activeSubscription = user?.subscriptions?.find(
      (sub) =>
        sub.diaryId.toString() === diary._id.toString() && new Date(sub.expiresAt) > new Date()
    );

    isPurchased = Boolean(
      activeSubscription ||
      (diary.purchasedBy && diary.purchasedBy.some((id) => id.toString() === currentUserId)) ||
      (user?.unlockedDiaries &&
        user.unlockedDiaries.some((id) => id.toString() === diary._id.toString()))
    );
  }

  const isFree = diary.accessType === 'free' || (!diary.isPremium && (diary.price || 0) <= 0);
  const isUnlocked = isOwner || isPurchased || isFree;

  // Resolve creator's direct payout details (for direct UPI payment & scanner)
  const creator = await User.findById(diary.userId).select('name payoutSettings');
  const creatorPayout = {
    upiId: diary.upiId || creator?.payoutSettings?.upiId || '',
    accountHolderName: creator?.payoutSettings?.accountHolderName || creator?.name || diary.author,
    payoutMethod: creator?.payoutSettings?.payoutMethod || 'upi',
  };

  const resolvedPlans = diary.plans || {
    weekly: { enabled: true, price: 49 },
    monthly: { enabled: true, price: diary.price || 149 },
    annual: { enabled: true, price: 899 },
  };

  if (isUnlocked) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...diary.toObject(),
          isUnlocked: true,
          isOwner,
          isPurchased,
          creatorPayout,
          accessType: diary.accessType || (diary.isPremium ? 'paid' : 'free'),
          plans: resolvedPlans,
          subscription: activeSubscription
            ? {
                isActive: true,
                planType: activeSubscription.planType,
                expiresAt: activeSubscription.expiresAt,
              }
            : null,
        },
        'Diary fetched successfully'
      )
    );
  }

  // Paywalled Diary: Reader has not unlocked yet
  const previewLimit = Math.max(0, diary.freePreviewEntries ?? 2);
  const chaptersWithPaywall = diary.chapters.map((ch, index) => {
    if (index < previewLimit) {
      return {
        ...ch.toObject(),
        isLocked: false,
        isPreview: true,
      };
    }
    return {
      _id: ch._id,
      title: ch.title,
      description: ch.description,
      date: ch.date,
      mood: ch.mood,
      weather: ch.weather,
      location: ch.location,
      timeOfDay: ch.timeOfDay,
      photosCount: ch.photos?.length || 0,
      videosCount: ch.videos?.length || 0,
      content:
        '🔒 This daily life memory is locked. Subscribe to this creator’s diary to read full entries and view photos & videos.',
      isLocked: true,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: diary._id,
        title: diary.title,
        subtitle: diary.subtitle,
        author: diary.author,
        coverImage: diary.coverImage,
        mood: diary.mood,
        category: diary.category,
        accessType: diary.accessType || (diary.isPremium ? 'paid' : 'free'),
        plans: resolvedPlans,
        isPremium: diary.isPremium,
        price: diary.price,
        freePreviewEntries: diary.freePreviewEntries,
        chapters: chaptersWithPaywall,
        createdAt: diary.createdAt,
        creatorPayout,
        isUnlocked: false,
        isOwner: false,
        isPurchased: false,
        lockedCount: Math.max(0, diary.chapters.length - previewLimit),
      },
      'Diary preview fetched successfully. Subscribe for full access.'
    )
  );
});

// ADD A NEW DAILY ENTRY ANYTIME
const addDiaryEntry = asyncHandler(async (req, res) => {
  const diary = await Book.findById(req.params.id);
  if (!diary) throw new ApiError(404, 'Diary not found');

  if (diary.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized to add entries to this diary');
  }

  const {
    title,
    description = '',
    content = '',
    date = new Date(),
    mood = diary.mood || 'Reflective',
    weather = 'Sunny',
    timeOfDay = 'Evening',
    location = '',
    photos = [],
    videos = [],
  } = req.body;

  const newEntry = await Chapter.create({
    title: title?.trim() || `Entry for ${new Date(date).toLocaleDateString()}`,
    description: description.trim(),
    content: content.trim(),
    date: new Date(date),
    mood,
    weather,
    timeOfDay,
    location: location.trim(),
    photos: Array.isArray(photos) ? photos : [],
    videos: Array.isArray(videos) ? videos : [],
  });

  diary.chapters.push(newEntry._id);
  await diary.save();

  const updatedDiary = await Book.findById(diary._id).populate('chapters');

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { entry: newEntry, diary: updatedDiary },
        'Daily entry logged successfully!'
      )
    );
});

// UPDATE SPECIFIC DAILY ENTRY
const updateDiaryEntry = asyncHandler(async (req, res) => {
  const { id, entryId } = req.params;
  const diary = await Book.findById(id);
  if (!diary) throw new ApiError(404, 'Diary not found');

  if (diary.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized');
  }

  const updatedEntry = await Chapter.findByIdAndUpdate(entryId, req.body, { new: true });
  return res.status(200).json(new ApiResponse(200, updatedEntry, 'Entry updated successfully'));
});

// DELETE SPECIFIC DAILY ENTRY
const deleteDiaryEntry = asyncHandler(async (req, res) => {
  const { id, entryId } = req.params;
  const diary = await Book.findById(id);
  if (!diary) throw new ApiError(404, 'Diary not found');

  if (diary.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized');
  }

  await Chapter.findByIdAndDelete(entryId);
  diary.chapters = diary.chapters.filter((chId) => chId.toString() !== entryId.toString());
  await diary.save();

  return res.status(200).json(new ApiResponse(200, null, 'Entry removed from diary'));
});

// UPLOAD MEDIA (Photos & Video clips)
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Media file is required');
  }

  const localPath = req.file.path?.replace(/\\/g, '/');
  const result = await uploadOnCloudinary(localPath);

  if (!result) {
    throw new ApiError(500, 'Failed to upload media to cloud');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url || result.url,
        resourceType: result.resource_type,
        format: result.format,
      },
      'Media uploaded successfully'
    )
  );
});

// GET PURCHASED / UNLOCKED DIARIES
const getPurchasedDiaries = asyncHandler(async (req, res) => {
  const diaries = await Book.find({
    purchasedBy: req.user._id,
  })
    .populate('chapters', 'title date mood photos videos')
    .sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, diaries, 'Purchased diaries fetched successfully'));
});

// UPDATE DIARY METADATA
const updateBook = asyncHandler(async (req, res) => {
  const diary = await Book.findById(req.params.id);

  if (!diary) throw new ApiError(404, 'Diary not found');

  if (diary.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized to update this diary');
  }

  const { chapters, ...diaryData } = req.body;

  if (chapters && Array.isArray(chapters)) {
    const updatedChapterIds = [];
    for (const ch of chapters) {
      if (ch._id) {
        await Chapter.findByIdAndUpdate(ch._id, {
          title: ch.title || 'Untitled Entry',
          description: ch.description || '',
          content: ch.content || '',
          date: ch.date ? new Date(ch.date) : undefined,
          mood: ch.mood,
          weather: ch.weather,
          timeOfDay: ch.timeOfDay,
          location: ch.location,
          photos: Array.isArray(ch.photos) ? ch.photos : [],
          videos: Array.isArray(ch.videos) ? ch.videos : [],
        });
        updatedChapterIds.push(ch._id);
      } else {
        const newCh = await Chapter.create({
          title: ch.title || 'Untitled Entry',
          description: ch.description || '',
          content: ch.content || '',
          date: ch.date ? new Date(ch.date) : new Date(),
          mood: ch.mood || diary.mood || 'Daily Life',
          weather: ch.weather || 'Sunny',
          timeOfDay: ch.timeOfDay || 'Morning',
          location: ch.location || '',
          photos: Array.isArray(ch.photos) ? ch.photos : [],
          videos: Array.isArray(ch.videos) ? ch.videos : [],
        });
        updatedChapterIds.push(newCh._id);
      }
    }
    diaryData.chapters = updatedChapterIds;
  }

  if (diaryData.accessType !== undefined) {
    diaryData.isPremium = diaryData.accessType === 'paid';
  }

  if (diaryData.plans !== undefined) {
    const weeklyPrice = Number(diaryData.plans?.weekly?.price) || 49;
    const monthlyPrice = Number(diaryData.plans?.monthly?.price) || 149;
    const annualPrice = Number(diaryData.plans?.annual?.price) || 899;

    diaryData.plans = {
      weekly: {
        enabled: diaryData.plans?.weekly?.enabled ?? true,
        price: weeklyPrice,
      },
      monthly: {
        enabled: diaryData.plans?.monthly?.enabled ?? true,
        price: monthlyPrice,
      },
      annual: {
        enabled: diaryData.plans?.annual?.enabled ?? true,
        price: annualPrice,
      },
    };

    diaryData.price = monthlyPrice;
  } else if (diaryData.price !== undefined) {
    diaryData.price = Number(diaryData.price) || 0;
    diaryData.isPremium = diaryData.price > 0;
  }

  if (diaryData.freePreviewEntries !== undefined) {
    diaryData.freePreviewEntries = Math.max(0, Number(diaryData.freePreviewEntries) || 0);
  }

  const updatedDiary = await Book.findByIdAndUpdate(req.params.id, diaryData, {
    new: true,
  }).populate('chapters');

  return res.status(200).json(new ApiResponse(200, updatedDiary, 'Diary updated successfully'));
});

// UPDATE COVER
const updateCover = asyncHandler(async (req, res) => {
  const diary = await Book.findById(req.params.id);
  if (!diary) throw new ApiError(404, 'Diary not found');

  if (diary.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized');
  }

  if (!req.file) {
    throw new ApiError(400, 'Cover image file is required');
  }

  const coverImageLocalPath = req.file.path?.replace(/\\/g, '/');
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  } catch (err) {
    console.error('Error uploading coverImage', err);
    throw new ApiError(500, 'Failed to upload cover image');
  }

  const updatedCover = await Book.findByIdAndUpdate(
    req.params.id,
    { coverImage: coverImage?.url },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedCover, 'Cover updated successfully'));
});

// DELETE DIARY
const deleteBook = asyncHandler(async (req, res) => {
  const diary = await Book.findById(req.params.id);
  if (!diary) throw new ApiError(404, 'Diary not found');

  if (diary.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, 'Not authorized');
  }

  if (diary.chapters && diary.chapters.length > 0) {
    await Chapter.deleteMany({ _id: { $in: diary.chapters } });
  }

  await diary.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Diary deleted successfully'));
});

export {
  createBook,
  updateBook,
  getBooks,
  getPublicDiaries,
  getPurchasedDiaries,
  updateCover,
  deleteBook,
  getBookById,
  addDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  uploadMedia,
};
