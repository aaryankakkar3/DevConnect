export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { errorMessage: error.message };
  }
  return { errorMessage: "An error occurred" };
};
