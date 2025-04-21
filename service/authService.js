export async function googleLogin(id, payload) {
  try {
    const response = await SC.postCall({
      url: `support-blogs/${id}`,
      data: payload,
      formData: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}
