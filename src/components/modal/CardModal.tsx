import React, { useState } from 'react';
// tarjeta
const CardModal = (props: {
  img: string | undefined;
  description: string | undefined;
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="rounded bg-white shadow-lg shadow-gray-100 duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:shadow-gray-500"
        onClick={() => setShowModal(true)}
      >
        <a href="#!">
          <img
            className="w-full"
            src={props.img}
            alt="Catedral San Marcos de Arica"
          />
        </a>
      </div>

      {showModal ? (
        <>
          <div
            className=" fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/50 outline-none focus:outline-none"
            onClick={(event) => {
              event.preventDefault();
              document.body.style.overflow = '';
              if (event.target === event.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <div className="grid grid-flow-row justify-center rounded text-neutral-600 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:w-8/12">
              <div className="col-span-2 flex w-full flex-wrap items-center justify-center rounded text-gray-800">
                <div className="w-full ">
                  <img
                    className="w-full rounded-l-lg"
                    src={props.img}
                    alt="Catedral San Marcos de Arica"
                  />
                </div>
              </div>
              <div className="flex w-full flex-wrap rounded-r-lg bg-white text-gray-800">
                <div className="m-8 w-full">
                  <p className=" text-justify text-lg font-bold capitalize">
                    descripción
                  </p>
                  <p className="my-4 text-justify text-base text-gray-800">
                    {props.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CardModal;
