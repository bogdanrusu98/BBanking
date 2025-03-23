import React, { useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { FaPiggyBank } from "react-icons/fa6";

function Index() {
  useEffect(() => {
    initFlowbite();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="">
      {/* Navbar */}
      <nav className="bg-white border-gray-200 dark:bg-gray-900 mb-2">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center mr-4  sm:inline-flex">
            <FaPiggyBank className="text-2xl logo dark:text-white" /> &nbsp;
            <span className="self-center text-2xl logo font-semibold whitespace-nowrap dark:text-white">BBANKING</span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link to="/sign-up">
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-xl text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Get started
              </button>
            </Link>
           
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r rounded-xl from-green-500 to-green-700 text-green-100 dark:from-green-700 dark:to-green-900">
        <div className="container mx-auto px-6 py-20 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Trimite bani oriunde în lume rapid și sigur
            </h1>
            <p className="text-lg mb-8">
              Schimbă bani la cursuri reale de schimb, fără taxe ascunse. Simplu, rapid, și de încredere.
            </p>
            <Link to="/sign-up">
              <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                Începe acum
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1616077168712-fc6c788db4af?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Transferuri rapide"
              className="w-full rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            De ce să alegi serviciul nostru?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-700">
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4 dark:bg-green-200">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-6 12h.01M12 15v2m6 0v2m6 0v-5.382a2 2 0 00-.894-1.789l-1.618-1.07A4 4 0 0018 8.618V8a6 6 0 00-6-6 6 6 0 00-6 6v.618a4 4 0 00-.488 2.141L3.894 11.829A2 2 0 003 13.618V19h18z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 dark:text-white">Transferuri rapide</h3>
              <p className="text-gray-600 dark:text-gray-300">Trimite bani în câteva minute către oricine, oriunde în lume.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-700">
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4 dark:bg-green-200">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-3.866 0-7 1.79-7 4 0 1.15.88 2.179 2.185 3.053a8.787 8.787 0 005.815 2.44v1.948c0 .61.4 1.159 1 1.159s1-.549 1-1.159v-1.948a8.787 8.787 0 005.815-2.44C18.12 14.179 19 13.15 19 12c0-2.21-3.134-4-7-4z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 dark:text-white">Cursuri de schimb reale</h3>
              <p className="text-gray-600 dark:text-gray-300">Fără taxe ascunse, doar cursuri de schimb reale.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-700">
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4 dark:bg-green-200">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 dark:text-white">Siguranță garantată</h3>
              <p className="text-gray-600 dark:text-gray-300">Ne asigurăm că banii tăi ajung în siguranță la destinație.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800 dark:text-white">Cifre care contează</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-green-50 rounded-xl p-8 dark:bg-gray-800">
              <h3 className="text-5xl font-bold text-green-600 mb-4 dark:text-green-400">1M+</h3>
              <p className="text-gray-600 dark:text-gray-300">Tranzacții procesate</p>
            </div>
            <div className="bg-green-50 rounded-xl p-8 dark:bg-gray-800">
              <h3 className="text-5xl font-bold text-green-600 mb-4 dark:text-green-400">99.9%</h3>
              <p className="text-gray-600 dark:text-gray-300">Rata de succes</p>
            </div>
            <div className="bg-green-50 rounded-xl p-8 dark:bg-gray-800">
              <h3 className="text-5xl font-bold text-green-600 mb-4 dark:text-green-400">24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">Suport disponibil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">Ce spun clienții noștri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8 dark:bg-gray-700">
              <p className="text-gray-600 mb-4 dark:text-gray-300">
                "Cel mai bun serviciu de transferuri pe care l-am folosit vreodată. Rapid și sigur!"
              </p>
              <p className="font-semibold dark:text-white">- Maria P.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 dark:bg-gray-700">
              <p className="text-gray-600 mb-4 dark:text-gray-300">
                "Cursurile de schimb sunt excelente și nu există taxe ascunse. Recomand cu încredere!"
              </p>
              <p className="font-semibold dark:text-white">- Andrei M.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 dark:bg-gray-700">
              <p className="text-gray-600 mb-4 dark:text-gray-300">
                "Suportul lor este fantastic. M-au ajutat rapid cu orice întrebare am avut."
              </p>
              <p className="font-semibold dark:text-white">- Elena D.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-500 text-green-100 py-16 dark:from-green-900 dark:to-green-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Începe să economisești la transferurile tale internaționale</h2>
          <p className="text-lg mb-8">Înscrie-te astăzi și bucură-te de cele mai bune cursuri de schimb.</p>
          <Link to="/sign-up">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Creează-ți un cont gratuit
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Index;