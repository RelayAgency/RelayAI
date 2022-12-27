import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Kanban, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, Line } from './pages';

import {ProductDescription, ColdDM, FacebookPost, InstagramPost, LinkedinPost, TikTokScript, YoutubeIdea, ColdEmail, EmailMarketing, FollowUpEmail, PersonalizedEmail, SubjectLine, ImageAltText, Keywords, MetaDescription, TitlesHeadings, WebsiteCopy } from './pages';
import { ProductDescriptionFunction } from './pages/AiContent/ProductDescription';


import { useStateContext } from './contexts/ContextProvider';

import './App.css'

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);



  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent
              content="Settings"
              position="Top"
            >
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>

            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            {themeSettings && <ThemeSettings />}

            <div>
              <Routes>
                {/* Dashboard */}
                {/* <Route path="/" element={<Ecommerce />} /> */}
                {/* <Route path="/" element={<Ecommerce />} /> */}

                {/* Product Descriptions */}
                <Route path="/" element={<ProductDescription />} />
                <Route path="/product descriptions" element={<ProductDescription />} />

                {/* Social Media */}
                <Route path="/cold dms" element={<ColdDM />} />
                <Route path="/facebook posts" element={<FacebookPost />} />
                <Route path="/instagram posts" element={<InstagramPost />} />
                <Route path="/linkedin posts" element={<LinkedinPost />} />
                <Route path="/tiktok scripts" element={<TikTokScript />} />
                <Route path="/youtube ideas" element={<YoutubeIdea />} />

                {/* Email/Letter */}
                <Route path="/cold emails" element={<ColdEmail />} />
                <Route path="/email marketing" element={<EmailMarketing />} />
                <Route path="/follow up emails" element={<FollowUpEmail />} />
                <Route path="/personalized emails" element={<PersonalizedEmail />} />
                <Route path="/subject lines" element={<SubjectLine />} />
                
                {/* SEO */}
                <Route path="/image alt text" element={<ImageAltText />} />
                <Route path="/keywords" element={<Keywords />} />
                <Route path="/meta descriptions" element={<MetaDescription />} />
                <Route path="/titles & headings" element={<TitlesHeadings />} />
                <Route path="/website copy" element={<WebsiteCopy />} />

              </Routes >
            </div>
            <Footer />
          </div>
        </div>
        
      </BrowserRouter>
      
    </div>
  )
}

export default App