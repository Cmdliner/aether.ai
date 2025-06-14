/**
 * A helper function to retry an async function with exponential backoff
 * @param fn The function to retry
 * @param retries Number of retries
 * @param delay Initial delay in ms
 * @param backoff Backoff factor
 * @returns The result of the function call or throws the last error
 */
export async function retry<T>(
  fn: () => Promise<T>, 
  retries = 3, 
  delay = 1000, 
  backoff = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    console.log(`Retrying operation after ${delay}ms, ${retries} attempts left`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * backoff, backoff);
  }
}
