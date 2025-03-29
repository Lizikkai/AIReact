export function sleep(delay: number = 1500) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}