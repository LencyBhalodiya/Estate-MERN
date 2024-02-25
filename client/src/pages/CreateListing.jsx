import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ACTION_IDS } from "@components/actions/action.constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@components/util/fetchers.js"


const schema = z.object({
    name: z.string().min(4).max(30),
    description: z.string().min(5).max(180),
    address: z.string().min(8).max(90),
    type: z.string().optional(),
    parking: z.boolean().optional(),
    furnished: z.boolean().optional(),
    offer: z.boolean().optional(),
    bedrooms: z.coerce.number().gte(1).lte(18),
    bathrooms: z.coerce.number().gte(1).lte(18),
    regularPrice: z.coerce.number().gte(30).lte(999999999),
    discountPrice: z.coerce.number().optional(),
})
export default function CreateListing() {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [filesUrls, setFilesUrls] = useState({
        imageUrls: [],

    });
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            bedrooms: 1,
            bathrooms: 1,
            regularPrice: 30,
            type: 'rent'
        }
    });
    const onSubmit = async (formData) => {
        try {
            formData.imageUrls = filesUrls.imageUrls;
            if (filesUrls.imageUrls.length < 1)
                return setError("root", { message: 'Atleast upload 1 image' })

            if (+formData.regularPrice < +formData.discountPrice)
                return setError("root", { message: 'Regular price must be greater than discount price' })

            const { data, statusCode } = await api.post(ACTION_IDS.CREATE_LISTING, { ...formData, userRef: currentUser._id })
            if (statusCode >= 400) {
                return setError("root", { message: 'Some Error Occured' })
            }
            statusCode == 201 && navigate(`/listing/${data._id}`)

        } catch (error) {
            return setError("root", { message: 'Some Error occured, please try again or check your info' })
        }
    }
    const [imageUploadError, setImageUploadError] = useState(false);
    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + filesUrls.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            let promises = [];
            for (let file of files) {
                promises.push(uploadImage(file));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFilesUrls({
                        ...filesUrls,
                        imageUrls: filesUrls.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch(() => {
                    setImageUploadError("Image upload failed (2 mb max per image)");
                    setUploading(false);
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
            setUploading(false);
        }
    };
    const uploadImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred + snapshot.totalBytes) * 100;
                    console.log("upload is " + progress + "%");
                },
                (err) => {
                    reject(err);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };
    const handleRemoveImage = (index) => {
        setFilesUrls({
            ...filesUrls,
            imageUrls: filesUrls.imageUrls.filter((url, i) => i != index),
        });
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Create Listing
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        {...register("name")}
                        type="text"
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                    />
                    {errors.name && (<div className="text-red-500">{errors.name.message}</div>)}
                    <textarea
                        {...register("description")}
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                    />
                    {errors.description && (<div className="text-red-500">{errors.description.message}</div>)}
                    <input
                        {...register("address")}
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                    />
                    {errors.address && (<div className="text-red-500">{errors.address.message}</div>)}
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                {...register("type")}
                                type="radio"
                                className="w-5"
                                value='sale'
                                name='type'
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                {...register("type")}
                                type="radio"
                                value='rent'
                                name='type'
                                className="w-5"
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                {...register("parking")}
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                {...register("furnished")}
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                {...register("offer")}
                                type="checkbox"
                                id="offer"
                                className="w-5"
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                {...register("bedrooms")}
                                type="number"
                                id="bedrooms"
                                className="p-3 w-24 border border-gray-300 rounded-lg"
                            />
                            <p> Beds </p>
                        </div>
                        {errors.bedrooms && (<div className="text-red-500">{errors.bedrooms.message}</div>)}
                        <div className="flex items-center gap-2">
                            <input
                                {...register("bathrooms")}
                                type="number"
                                id="bathrooms"
                                className="p-3 border w-24 border-gray-300 rounded-lg"
                            />
                            <p> Baths </p>
                        </div>
                        {errors.bathrooms && (<div className="text-red-500">{errors.bathrooms.message}</div>)}
                        <div className="flex items-center gap-2">
                            <input
                                {...register("regularPrice")}
                                type="number"
                                id="regularPrice"
                                className="p-3 w-24 border border-gray-300 rounded-lg"
                            />
                            <div className="flex flex-col items-center">
                                <p> Regular price</p>
                                <span className="text-xs"> ($ / month)</span>
                            </div>
                        </div>
                        {errors.regularPrice && (<div className="text-red-500">{errors.regularPrice.message}</div>)}
                        <div className="flex items-center gap-2">
                            <input
                                {...register("discountPrice")}
                                type="number"
                                id="discountPrice"
                                className="p-3 border w-24 border-gray-300 rounded-lg"
                            />
                            <div className="flex flex-col items-center">
                                <p> DiscountPrice price </p>
                                <span className="text-xs"> ($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold">
                        {" "}
                        Images:{" "}
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            {...register("imageUrls")}
                            onChange={(e) => setFiles(e.target.files)}
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button
                            disabled={uploading}
                            type="button"
                            onClick={handleImageSubmit}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {uploading ? "Uploading...." : "Upload"}
                        </button>
                    </div>
                    <p className="text-red-700 text-sm">
                        {imageUploadError && imageUploadError}
                    </p>
                    {filesUrls.imageUrls.length > 0 &&
                        filesUrls.imageUrls.map((url, index) => (
                            <div
                                key={url}
                                className="flex justify-between p-3 border items-center"
                            >
                                <img
                                    src={url}
                                    alt="listing house of pic"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                                >
                                    {" "}
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button disabled={isSubmitting || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        {isSubmitting ? 'Creating...' : 'Create Listing'}
                    </button>
                    {errors.root && (<div className="text-red-500">{errors.root.message}</div>)}
                </div>
            </form>
        </main>
    );
}
