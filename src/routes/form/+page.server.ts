import type { Actions } from './$types.js';

export const actions = {
    "file-upload": async ({ request }) => {
        const data = await request.formData();
        const files = data.getAll('files');
        console.log(files)


        return { success: true };
    }
} satisfies Actions;