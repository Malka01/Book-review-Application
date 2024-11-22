import axios from "axios";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { errorToast } from "../util/toastify";
import { FaStar } from "react-icons/fa";
import { Navbar } from "./ui/navbar";
import { ArrowRight, Pen } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { ReviewDialog } from "./ui/review-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export const SelectedReviewsPage = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  // get id from url
  const { id } = useParams();

  const loadReviews = useCallback(async () => {
    setLoading(true);
    axios
      .get("/reviews/" + id)
      .then(({ data }) => {
        setReview(data?.review);
      })
      .catch((error) => {
        errorToast(error?.response?.data?.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const deleteReview = async () => {
    axios
      .delete(`/reviews/${id}`)
      .then(() => {
        loadReviews();
      })
      .catch((error) => {
        errorToast(error?.response?.data?.message || "An error occurred");
      });
  };

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (loading) {
    return (
      <div className="flex w-full max-w-7xl justify-center py-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl py-3">
      {/* review dialog */}
      <ReviewDialog
        isOpen={open}
        setIsOpen={setOpen}
        currentData={currentData}
        fetch={loadReviews}
      />
      {/* navbar */}
      <Navbar />
      <div className="flex justify-end">
        {/* add new review button */}
        {user && (
          <Button
            size="sm"
            className="w-full max-w-40"
            onClick={() => setOpen(true)}
          >
            Add New Review
          </Button>
        )}
      </div>

      {/* reviews list */}
      <div className="mt-4 space-y-4">
        {review && (
          <div
            key={review.id}
            className="flex flex-col rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between gap-x-3">
              <div className="">
                <p className="text-sm font-medium">
                  {review.user.firstName} {review.user.lastName}
                </p>
                <p className="text-[0.65rem] text-gray-500">
                  {/* get local date and time format */}
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-x-1">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <FaStar className="text-amber-500" key={index} size={16} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">
              Book : {review.title} ({review.author}) | Rating:{" "}
              {review.book.averageRating}
            </p>
            <p className="mt-2 text-sm">{review.review}</p>

            <div className="mt-2 flex justify-end">
              {/* edit button */}
              {review.isReviewGiven && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit rounded-full"
                  onClick={() => {
                    setCurrentData(review);
                    setOpen(true);
                  }}
                >
                  <Pen />
                </Button>
              )}
              {/* delete button */}
              {review.isReviewGiven && (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <MdDelete className="!size-5 rounded-full !text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the review.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteReview(review.id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* view more button */}
              <Link to={`/reviews/${review.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit rounded-full"
                >
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* no reviews message */}
        {!review && (
          <div className="flex justify-center">
            <p>No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
