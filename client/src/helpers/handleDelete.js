export const deleteData = async (url) => {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await res.json(); 

    if (!res.ok) {
      // Return full error message
      return {
        success: false,
        message: data.message || 'Failed to delete.',
      };
    }

    return data;

  } catch (error) {
    return {
      success: false,
      message: error?.message || 'Something went wrong.',
    };
  }
};


