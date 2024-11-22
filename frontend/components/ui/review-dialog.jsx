/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import axios from "axios";
import { reviewSchema } from "../../validations";
import { transferZodErrors } from "../../util/transfer-zod-errors";
import { errorToast, successToast } from "../../util/toastify";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { PiSpinnerBold } from "react-icons/pi";
import { Textarea } from "./textarea";
import { FaStar } from "react-icons/fa";

export const ReviewDialog = ({ isOpen, setIsOpen, currentData, fetch }) => {
  const [data, setData] = useState({
    isbn: "",
    title: "",
    author: "",
    rating: 0,
    review: "",
  });

  const [error, setError] = useState({
    isbn: "",
    title: "",
    author: "",
    rating: "",
    review: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ isbn: "", title: "", author: "", rating: "", review: "" });

    const validatedData = reviewSchema.safeParse(data);

    if (!validatedData.success) {
      setError(transferZodErrors(validatedData.error.errors).error);
      return;
    }

    axios({
      method: currentData ? "put" : "post",
      url: `/reviews` + (currentData ? `/${currentData.id}` : ""),
      data,
    })
      .then(({ data }) => {
        if (data.success) {
          successToast("Review added successfully");
          setIsOpen(false);
          setData({
            isbn: "",
            title: "",
            author: "",
            rating: 0,
            review: "",
          });
        }
      })
      .then(() => {
        fetch();
      })
      .catch((error) => {
        errorToast(error?.response?.data?.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentData) {
      setData({
        isbn: currentData.isbn,
        title: currentData.title,
        author: currentData.author,
        rating: currentData.rating,
        review: currentData.review,
      });
    }
  }, [currentData]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentData ? "Update Review" : "Add New Review"}
          </DialogTitle>
          <DialogDescription />

          <div className="grid gap-4 pt-5">
            {/* isbn */}
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                type="text"
                placeholder="1234567890123"
                required
                onChange={handleChange}
                value={data.isbn}
                disabled={currentData}
              />
              {/* error message */}
              {error.isbn && (
                <p className="text-xs text-red-500">{error.isbn}</p>
              )}
            </div>

            {/* title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                required
                onChange={handleChange}
                value={data.title}
              />
              {/* error message */}
              {error.title && (
                <p className="text-xs text-red-500">{error.title}</p>
              )}
            </div>

            {/* author */}
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                placeholder="Author"
                required
                onChange={handleChange}
                value={data.author}
              />
              {/* error message */}
              {error.author && (
                <p className="text-xs text-red-500">{error.author}</p>
              )}
            </div>

            {/* rating */}
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>

              {/* 5 stars */}
              <div className="flex gap-x-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`${
                      data.rating > index ? "!text-amber-500" : "text-gray-500"
                    } ${data.rating === index + 1 && "!text-amber-500"} p-0`}
                    type="button"
                    onClick={() => {
                      setData({ ...data, rating: index + 1 });
                    }}
                  >
                    <FaStar className="!h-6 !w-6" />
                  </Button>
                ))}
              </div>

              {/* error message */}
              {error.rating && (
                <p className="text-xs text-red-500">{error.rating}</p>
              )}
            </div>

            {/* review */}
            <div className="grid gap-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                type="text"
                placeholder="Review"
                required
                rows={5}
                onChange={handleChange}
                value={data.review}
              />
              {/* error message */}
              {error.review && (
                <p className="text-xs text-red-500">{error.review}</p>
              )}
            </div>

            <Button type="button" onClick={handleSubmit} className="w-full">
              {loading && (
                <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
              )}
              Submit Review
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
