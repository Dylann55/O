import React, { useState } from 'react';

import supabase from '../../db/supabaseClient';

interface IRubrics {
  name: string;
  createAt: string;
  editAt: string;
}
// tarjeta
const CreateRubricModal = (prop: { readRubrics: any }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  async function createRubric(rubricName: string) {
    setShowModal(false);

    const { data /* , error */ }: { data: IRubrics | null; error: any } | any =
      await supabase
        .from('rubrics')
        .insert({ name: rubricName })
        .select()
        .then((res) => {
          return res;
        });

    if (data) {
      const temp = sessionStorage.getItem('rubrics');
      if (temp) {
        const tempRubrics: Array<IRubrics> = JSON.parse(temp);
        sessionStorage.setItem(
          'rubrics',
          JSON.stringify(data.concat(tempRubrics))
        );
        setName('');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        prop.readRubrics();
      } else {
        /* 
        alert(JSON.stringify(error)); */
      }
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="right-0 mb-2 ml-2 rounded bg-uta-tertiary py-2 px-4 text-white shadow"
      >
        Crear Rubrica
      </button>

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
            <div className=" grid justify-center divide-y-2 rounded ">
              <div className="w-96 divide-y-2 rounded bg-white p-4">
                <h2 className="p-2 font-bold">Crear Rubrica</h2>
                <div className="p-2">
                  <label
                    htmlFor="email"
                    className="block pt-2 text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full rounded border-gray-300 focus:border-gray-400 "
                      placeholder="Nombre de la rubrica"
                      value={name || ''}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mt-8 flex w-full flex-row-reverse">
                    <button
                      onClick={() => createRubric(name)}
                      className="right-0 rounded bg-uta-tertiary py-1 px-2 text-sm text-white"
                    >
                      Crear Rubrica
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CreateRubricModal;
