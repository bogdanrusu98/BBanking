import React from 'react';
import { useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.config';

function Index() {

    useEffect(() => {
        initFlowbite()
      }, [])

      const navigate = useNavigate()
    
      useEffect(() => {
        if (auth.currentUser) {
          navigate('/home'); 
        }
      }, [navigate]);
  return (
    <div>
      

<nav class="bg-white border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BBanking</span>
  </a>
  <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
    <Link to='/sign-up'>
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
      </Link>
      <button data-collapse-toggle="navbar-cta" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
    <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="#" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div>
  </div>
</nav>


      {/* Hero Section */}
      <header className="bg-gradient-to-r  from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-20 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Trimite bani oriunde în lume rapid și sigur
            </h1>
            <p className="text-lg mb-8">
              Schimbă bani la cursuri reale de schimb, fără taxe ascunse. Simplu, rapid, și de încredere.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300">
              Începe acum
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://via.placeholder.com/500x300"
              alt="Transferuri rapide"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            De ce să alegi serviciul nostru?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-6 12h.01M12 15v2m6 0v2m6 0v-5.382a2 2 0 00-.894-1.789l-1.618-1.07A4 4 0 0018 8.618V8a6 6 0 00-6-6 6 6 0 00-6 6v.618a4 4 0 00-.488 2.141L3.894 11.829A2 2 0 003 13.618V19h18z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Transferuri rapide</h3>
              <p className="text-gray-600">Trimite bani în câteva minute către oricine, oriunde în lume.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-3.866 0-7 1.79-7 4 0 1.15.88 2.179 2.185 3.053a8.787 8.787 0 005.815 2.44v1.948c0 .61.4 1.159 1 1.159s1-.549 1-1.159v-1.948a8.787 8.787 0 005.815-2.44C18.12 14.179 19 13.15 19 12c0-2.21-3.134-4-7-4z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Cursuri de schimb reale</h3>
              <p className="text-gray-600">Fără taxe ascunse, doar cursuri de schimb reale.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Siguranță garantată</h3>
              <p className="text-gray-600">Ne asigurăm că banii tăi ajung în siguranță la destinație.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Începe să economisești la transferurile tale internaționale</h2>
          <p className="text-lg mb-8">Înscrie-te astăzi și bucură-te de cele mai bune cursuri de schimb.</p>
          <Link to='sign-up'>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300">
            Creează-ți un cont gratuit
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Index;
