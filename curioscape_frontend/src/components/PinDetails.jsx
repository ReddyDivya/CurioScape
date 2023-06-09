import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';//fetching the query
import Spinner from './Spinner';

/*
Displays download icon | destination link | title and about | postedby's image and name | comment | add comment
*/

const PinDetails = ({user}) => {
  const { pinId } = useParams();//param

  const [pins, setPins] = useState();//showing 'more like this' pins
  const [pinDetail, setPinDetail] = useState();//for showing pin details
  const [comment, setComment] = useState('');//for adding comments
  const [addingComment, setAddingComment] = useState(false);

  //fetch pin details
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);//fetching pin details query

    if(query)
    {
      client.fetch(`${query}`)
      .then((data) => {
        setPinDetail(data[0]);//set pin details

        //pin details exists
        if(data[0])
        {
          //fetching 'more pin details' query
          const query1 = pinDetailMorePinQuery(data[0]);

          client.fetch(query1)
          .then((result) => {
            setPins(result);//set pins
          });
        }//if
      })
    }//if
  };//fetchPinDetails 

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  //add comment
  const addComment = () => {
    alert(pinId)
    alert(comment)
    
    //comment exists
    if (comment) 
    {
      setAddingComment(true);//adding comment

      client
      .patch(pinId)
      .setIfMissing({comments: []})
      .insert('after', 'comments[-1]', [{
        comment,
        _key: uuidv4(),
        userId: user?.sub,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id,
        },
      }])

      // client.patch(pinId)
      // .setIfMissing({comments : []})
      // .insert('after', 'comments[-1]', 
      // [{comment, 
      //   _key: uuidv4(),
      //   userId: user?.sub,
      //   postedBy: {
      //     _type: 'postedBy',
      //     _ref: user?.sub,
      //   },
      // }])
        
      .commit()
      .then(() => {
        fetchPinDetails();//fetch pin details
        setComment('');//set comment empty
        setAddingComment(false);
      })
    }//if
  };//addComment

  //shows "spinner message" while fetching the pin details
  if (!pinDetail) {
    return (
      <Spinner message="Showing pin" />
    );
  }//if

  return (
    <>
      {
        //Displays image on left 
        pinDetail && (
          <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
            
            {/* Displays image on left  */}
            <div className="flex justify-center items-center md:items-start flex-initial">
              <img
                className="rounded-t-3xl rounded-b-lg"
                src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
                alt="user-post"
              />
            </div>
            
            {/* Displays download icon | destination link | title and about | postedby's image and name | comment | add comment */}
            <div className="w-full p-5 flex-1 xl:min-w-620">
              <div className="flex items-center justify-between">
                
                {/* Displays download icon  */}
                <div className="flex gap-2 items-center">
                  <a
                    href={`${pinDetail.image.asset.url}?dl=`}
                    download
                    className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                  >
                    <MdDownloadForOffline />
                  </a>
                </div>

                {/* Displays destination link */}
                <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                  {pinDetail.destination?.slice(8)}
                </a>
              </div>

              {/* Displays title and about */}
              <div>
                <h1 className="text-4xl font-bold break-words mt-3">
                  {pinDetail.title}
                </h1>
                <p className="mt-3">{pinDetail.about}</p>
              </div>

              {/* Displays postedby's image and name section */}
              <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
                <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
                <p className="font-bold">{pinDetail?.postedBy.userName}</p>
              </Link>

              {/* Displays comment details section */}
              <h2 className="mt-5 text-2xl">Comments</h2>
              <div className="max-h-370 overflow-y-auto">
                {pinDetail?.comments?.map((item) => (
                  <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
                    <img
                      src={item.postedBy?.image}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      alt="user-profile"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">{item.postedBy?.userName}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Displays add comment section */}
              <div className="flex flex-wrap mt-6 gap-3">
                
                {/* Displays user-profile image */}
                <Link to={`/user-profile/${user._id}`}>
                  <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                </Link>

                {/* Displays comment text field */}
                <input
                  className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {/* Displays 'Done' button to add comment */}
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                  onClick={addComment}
                >
                  {addingComment ? 'Doing...' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        )
      }
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  )
}

export default PinDetails
