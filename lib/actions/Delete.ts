import toast from "react-hot-toast";

export const EmailDelete = async (id: string) => {
    try {
        const res = await fetch('/api/email/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailId: id }),
        });

        if (!res.ok) {
            throw new Error('Failed to delete email');
        }
        toast.success("Succesfully Delete",
            {
                position: "top-center"
            }
        );
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Delete error:', error);
        toast.error("Server Error", { position: "top-center" })
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};


export const TemplateDelete = async (id: string) => {
    try {
        const res = await fetch(`/api/template/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error('Failed to delete Template');
        }
        toast.success("Succesfully Delete",
            {
                position: "top-center"
            }
        );
        const data = await res.json();
        return { success: true, data }
    } catch (error) {
        console.error('Delete error:', error);
        toast.error("Server Error", { position: "top-center" })
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}