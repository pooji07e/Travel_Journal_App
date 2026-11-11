// Media and Quota Limits Configuration
// Shared across client and server to keep limits single-sourced and easy to adjust.

export const MEDIA_LIMITS = {
  // Photo limits
  PHOTO_ALLOWED_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ] as const,
  PHOTO_MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB before compression
  PHOTO_MAX_WIDTH_PX: 1600,
  MAX_PHOTOS_PER_ENTRY: 20,

  // Video limits
  VIDEO_ALLOWED_TYPES: [
    "video/mp4",
    "video/quicktime", // MOV
    "video/webm",
  ] as const,
  VIDEO_MAX_SIZE_BYTES: 100 * 1024 * 1024, // 100 MB per video
  VIDEO_MAX_DURATION_SECONDS: 60, // 60 seconds
  MAX_VIDEOS_PER_ENTRY: 3,

  // User storage quota
  USER_STORAGE_QUOTA_BYTES: 1024 * 1024 * 1024, // 1 GB default per user
  WARNING_THRESHOLD_PERCENT: 80, // Warn above 80% usage
} as const;

export function formatBytes(bytes: number | bigint): string {
  const numBytes = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (numBytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
