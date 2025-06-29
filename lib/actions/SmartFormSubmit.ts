import toast from "react-hot-toast";

export const SmartFormSubmit = async (EmailData: any) => {
    try {
        if(!EmailData.content || !EmailData?.subject || !EmailData?.recipientName){
            toast.error("Please Fill the form fully",{position:"top-center"});
            return;
        }
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: EmailData.content,
          subject: EmailData.subject,
          to: EmailData.recipientName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to send email: ${errorData.error || 'Unknown error'}`,{position:"top-center"});
        return;
      }

      toast.success(' Email sent successfully!',{position:"top-center"});
      return {message:"Email SuccessFully sent "}
    } catch (error) {
      toast.error('Failed to send email due to network or server error.',{
        position:"top-center"
      });
    }
  };