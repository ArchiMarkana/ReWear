// Utility function to get full image URL
// If the URL is a relative path (starts with /uploads/), prepend the backend URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "https://via.placeholder.com/300x300?text=No+Image";
  }
  
  // If it's already a full URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path (starts with /uploads/), prepend backend URL
  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:5000${imageUrl}`;
  }
  
  // Otherwise, return as is (might be a data URL or other format)
  return imageUrl;
};

