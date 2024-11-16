import React from "react";
import { useForm } from "react-hook-form";

const AuctionForm = ({ handleFormData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = (data) => {
    handleFormData(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Auction</h2>
      <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Car Brand */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="carBrand"
            >
              Car Brand <span className="text-red-800"><sup>*</sup></span>
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="carBrand"
                {...register("carBrand", { required: "Car brand is required" })}
              >
                <option value="">Select a brand</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Toyota">Toyota</option>
                <option value="Ford">Ford</option>
              </select>
              {errors.carBrand && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.carBrand.message}
                </p>
              )}
            </div>
          </div>

          {/* Car Model */}
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="carModel"
            >
              Car Model <span className="text-red-800"><sup>*</sup></span>
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="carModel"
              type="text"
              placeholder="Car Model"
              {...register("carModel", { required: "Car model is required" })}
            />
            {errors.carModel && (
              <p className="text-red-500 text-xs mt-1">
                {errors.carModel.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          {/* Auction Start Time */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="startTime"
            >
              Auction Start Time <span className="text-red-800"><sup>*</sup></span>
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="startTime"
              type="datetime-local"
              {...register("startTime", { required: "Start time is required" })}
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>

          {/* Auction End Time */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="endTime"
            >
              Auction End Time <span className="text-red-800"><sup>*</sup></span>
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="endTime"
              type="datetime-local"
              {...register("endTime", { required: "End time is required" })}
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            data-testid={"create-btn"}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuctionForm;
