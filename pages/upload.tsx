import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { FaCloudUploadAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from "axios"
import { SanityAssetDocument } from "@sanity/client"

import useAuthStore from "../store/authStore"
import { topics } from "../utils/constants"
import { client } from "../utils/client"

const Upload = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >()
  const [wrongFileType, setWrongFileType] = useState(false)
  const [caption, setCaption] = useState("")
  const [category, setCategory] = useState(topics[0].name)
  const [savingPost, setSavingPost] = useState(false)

  const { userProfile }: { userProfile: any } = useAuthStore()

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0]
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"]

    setIsLoading(true)

    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then(data => {
          setVideoAsset(data)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
      setWrongFileType(true)
    }
  }

  const handlePost = async () => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true)

      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
      }

      await axios.post("http://localhost:3000/api/post", document)
      router.push("/") //to home page
    }
  }

  const discard = () => {
    setCaption("")
    setCategory(topics[0].name)
    setVideoAsset(undefined)
  }

  return (
    <div className='flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center '>
      <div className='bg-white rounded-lg w-[60%] xl:h-[80vh] flex gap-6 flex-wrap justify-around items-center p-14 pt-6'>
        <div>
          <div>
            <p className='text-2xl font-bold'>Upload Video</p>
            <p className='text-md text-gray-400 mt-1'>
              Post a video to your account
            </p>
          </div>
          <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-gray-400 hover:bg-gray-100'>
            {isLoading ? (
              <p>Uploading, please wait...</p>
            ) : (
              <div className=''>
                {videoAsset ? (
                  <div className=''>
                    <video
                      src={videoAsset.url}
                      loop
                      controls
                      className='rounded-xl h-[450px] mt-16 bg-black'></video>
                  </div>
                ) : (
                  <label className='cursor-pointer '>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <div className='flex flex-col items-center justify-center'>
                        <p className='font-bold text-xl'>
                          <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                        </p>
                        <p className='text-gray-600 font-semibold'>
                          Upload video
                        </p>
                      </div>
                      <p className='text-gray-400 text-center mt-6 test-sm leading-6'>
                        MP4 or WebM or ogg <br />
                        720x1280 or higher <br />
                        Up to 10 minutes <br />
                        Less than 2GB
                      </p>
                      <p className='bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                        Select File
                      </p>
                    </div>
                    <input
                      type='file'
                      name='upload-video'
                      className='w-0 h-0'
                      onChange={uploadVideo}
                    />
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className='text-center text-red-400 text-md mt-4 w-[250px]'>
                Please select a video file
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-3 pb-10'>
          <label className='text-md font-medium'>Caption</label>
          <input
            type='text'
            placeholder='Caption'
            className='rounded hover:border-gray-300 outline-none text-md border-2 border-gray-200 focus:border-[#F51997] p-2'
            value={caption}
            onChange={e => {
              setCaption(e.target.value)
            }}
          />
          <label className='text-md font-medium'>Choose a Category</label>
          <select
            className='rounded hover:border-gray-300 outline-none cursor-pointer text-md capitalize border-2 border-gray-200 focus:border-[#F51997] p-2'
            value={category}
            onChange={e => {
              setCategory(e.target.value)
            }}>
            {topics.map(topic => (
              <option
                className='text-gray-600'
                value={topic.name}
                key={topic.name}>
                <>{topic.name}</>
              </option>
            ))}
          </select>
          <div className='flex gap-6 mt-10'>
            <button
              onClick={discard}
              type='button'
              className='active:border-[#f51997] border-gray-200 hover:border-gray-300 cursor-pointer rounded border-2 text-md font-medium p-2 w-28 lg:w-44 outline-none'>
              Discard
            </button>
            <button
              onClick={handlePost}
              type='button'
              className='border-[#f51997] hover:bg-[#F51997] hover:text-white duration-500 cursor-pointer rounded border-2 text-md font-medium p-2 w-28 lg:w-44 outline-none'>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
