import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary environment variables');
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
    filePath: string,
    folder = 'profiles'
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            { folder },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload failed with no result'));
                }
                resolve(result);
            }
        );
    });
};


export default cloudinary;
