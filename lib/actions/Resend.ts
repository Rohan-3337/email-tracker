import toast from "react-hot-toast";

export const Resend = async (id: string) => {
  try {
    const res = await fetch('/api/email/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailId: id }),
    });

    if (!res.ok) {
      throw new Error('Failed to resend email');
    }

    const data = await res.json();
    toast.success("Succesfully Resend",{position:"top-center"})
    return { success: true, data };
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
