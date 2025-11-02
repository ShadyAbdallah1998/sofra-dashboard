/**
 * Generate user initials from first and last name
 * @param firstname - User's first name
 * @param lastname - User's last name
 * @returns Two-letter initials (e.g., "SA" for "Shady Abdallah") or "U" as fallback
 */
export function getInitials(firstname?: string | null, lastname?: string | null): string {
  const first = firstname?.trim().charAt(0).toUpperCase() || '';
  const last = lastname?.trim().charAt(0).toUpperCase() || '';
  const initials = `${first}${last}`;

  // If no initials, return "U" as fallback
  return initials.trim() || 'U';
}

/**
 * Generate a consistent background color based on user's name
 * @param name - User's full name or email
 * @returns Tailwind CSS color class
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Check if a string is a valid URL
 * @param url - String to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || url.trim() === '') return false;

  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch {
    return false;
  }
}
