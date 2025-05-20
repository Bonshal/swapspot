// Function to conditionally join class names together
export function cn(...args: (string | undefined | boolean | null)[]): string {
  return args
    .filter(Boolean)
    .join(' ')
    .trim();
}