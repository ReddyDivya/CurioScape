import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';

const Pin = ({pin}) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();//navigation

  //object destructuring
  const {postedBy, image, _id, destination} = pin;

  //fetching user from local storage
  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  //filtering saved pins
  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.googleId);
  
  //fetching saved pins
  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];
  
  //save pin
  const savePin = (id) => {

    //save pin only if it's not already saved
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
      .patch(id)
      .setIfMissing({save: []})
      .insert('after', 'save[-1]', [{
        _key: uuidv4(),
        userId: user?.sub,
        postedBy: {
          _type: 'postedBy',
          _ref: user?.sub,
        },
      }])
      .commit()
      .then(() => {
        window.location.reload();
        setSavingPost(false);
      });
    }
  };//savePin

  //delete pin
  const deletePin = (id) => {

  };//deletePin

  return (
    /* Display image and display download icon on mouse hover */
    <div className='m-2'>
      <div className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      onClick={() => navigate(`/pin-detail/${_id}`)}
    >
      {
        image && (<img className="rounded-lg w-full" alt="user-post" src={(urlFor(image).width(250).url())}/>)
      }
      
      {
        /* Display 'download icon' and 'save' button on mouse hover */
        postHovered && ( 
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}>
              <div className="flex items-center justify-between">
                {/* Display download icon */}
                <div className="flex gap-2">
                    <a
                      href={`${image?.asset?.url}?dl=`}
                      download
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                    >
                      <MdDownloadForOffline />
                    </a>
                </div>
                {
                  /* Already saved pins */
                  alreadySaved.length !== 0 ?
                  (
                    <button type="button" className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                      {pin?.save?.length} Saved
                    </button>
                  ):
                  (
                    /* Display 'save' button */
                    <button type="button"
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}>
                        {pin?.save?.length} {savingPost ? 'Saving' : 'Save'}
                    </button>
                  )
                }
              </div>  
              <div className="flex justify-between items-center gap-2 w-full">
                  {
                    destination?.slice(8).length > 0 ? 
                    (
                      <a href={destination}
                        target="_blank"
                        className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                        rel="noreferrer"
                      >
                         {' '}
                         <BsFillArrowUpRightCircleFill />
                         {destination?.slice(8, 17)}...
                      </a>  
                    )
                    :
                    undefined
                  }

                  {
                    //display delete icon
                    postedBy?._id === user?.sub && (
                      <button type="button"
                        className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePin(_id);
                        }}
                      >
                        <AiTwotoneDelete />
                      </button>
                    )
                  }
              </div>
          </div>
        )}
    </div>

    {/* Display user-profile pic | name and navigate to userprofile component */}
    <Link to={`/user-profile/${postedBy?._id}`}
      className='flex gap-2 mt-2 items-center'>
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
    </Link>
  </div>
  )
}

export default Pin