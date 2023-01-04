import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Kanban, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, Line } from './pages';

import { ProductDescription, ColdDM, FacebookPost, InstagramPost, LinkedinPost, TikTokScript, YoutubeIdea, ColdEmail, EmailMarketing, FollowUpEmail, PersonalizedEmail, SubjectLine, ImageAltText, Keywords, MetaDescription, TitlesHeadings, WebsiteCopy } from './pages';

import { UserProfile, UserPrompts, UserSignUp, UserSignIn, ForgotPassword } from './pages';

import { useStateContext } from './contexts/ContextProvider';

import './App.css'

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, setActiveMenu, currentColor, themeSettings, setThemeSettings, setIsLoggedIn, activeProfile, setActiveProfile } = useStateContext();


  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);


  const isLoggedIn = localStorage.getItem('loggedIn');


  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            {isLoggedIn == "true" ?
              <TooltipComponent
                content="Settings"
                position="Top"
              >
                <div onClick={() => setActiveMenu(false)}>
                  <button
                    type="button"
                    onClick={() => setThemeSettings(true)}
                    style={{ background: currentColor, borderRadius: '50%' }}
                    className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  >

                    <FiSettings />

                  </button>
                </div>
              </TooltipComponent> : <></>}
          </div>
          {isLoggedIn == "true" ?
            <div>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
              {/* <Sidebar /> */}

            </div> : <></>}

          <div

            className={
              activeMenu && isLoggedIn == "true"
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen w-full md:ml-72 '
                : 'dark:bg-main-dark-bg bg-main-bg min-h-screen w-full flex-2 '
            }
          >
            {isLoggedIn == "true" ?
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div> : <></>}
            {isLoggedIn == "true" ? <div>{themeSettings &&

              <div onClick={() => setActiveProfile(false)}>
                <ThemeSettings />
              </div>

            }</div> : <></>}

            <div onClick={() => setActiveMenu(false)}>
              <div onClick={() => setActiveProfile(false)}>
                <Routes >
                  {/* Dashboard */}
                  {/* <Route path="/" element={<Ecommerce />} /> */}
                  <Route path="/" element={isLoggedIn == "true" ? <UserProfile /> : <UserSignIn />} />

                  {/* Product Descriptions */}
                  <Route path="/product-descriptions" element={isLoggedIn == "true" ? <ProductDescription /> : <UserSignIn />} />

                  {/* Social Media */}
                  <Route path="/cold-dms" element={isLoggedIn == "true" ? <ColdDM /> : <UserSignIn />} />
                  <Route path="/facebook-posts" element={isLoggedIn == "true" ? <FacebookPost /> : <UserSignIn />} />
                  <Route path="/instagram-posts" element={isLoggedIn == "true" ? <InstagramPost /> : <UserSignIn />} />
                  <Route path="/linkedin-posts" element={isLoggedIn == "true" ? <LinkedinPost /> : <UserSignIn />} />
                  <Route path="/tiktok-scripts" element={isLoggedIn == "true" ? <TikTokScript /> : <UserSignIn />} />
                  <Route path="/youtube-ideas" element={isLoggedIn == "true" ? <YoutubeIdea /> : <UserSignIn />} />

                  {/* Email/Letter */}
                  <Route path="/cold-emails" element={isLoggedIn == "true" ? <ColdEmail /> : <UserSignIn />} />
                  <Route path="/email-marketing" element={isLoggedIn == "true" ? <EmailMarketing /> : <UserSignIn />} />
                  <Route path="/follow-up-emails" element={isLoggedIn == "true" ? <FollowUpEmail /> : <UserSignIn />} />
                  <Route path="/personalized-emails" element={isLoggedIn == "true" ? <PersonalizedEmail /> : <UserSignIn />} />
                  <Route path="/subject-lines" element={isLoggedIn == "true" ? <SubjectLine /> : <UserSignIn />} />

                  {/* SEO */}
                  <Route path="/image-alt-text" element={isLoggedIn == "true" ? <ImageAltText /> : <UserSignIn />} />
                  <Route path="/keywords" element={isLoggedIn == "true" ? <Keywords /> : <UserSignIn />} />
                  <Route path="/meta-descriptions" element={isLoggedIn == "true" ? <MetaDescription /> : <UserSignIn />} />
                  <Route path="/titles-&-headings" element={isLoggedIn == "true" ? <TitlesHeadings /> : <UserSignIn />} />
                  <Route path="/website-copy" element={isLoggedIn == "true" ? <WebsiteCopy /> : <UserSignIn />} />


                  {/* USER */}
                  <Route path="/register" element={isLoggedIn == "true" ? <UserProfile /> : <UserSignUp />} />
                  <Route path="/sign-in" element={isLoggedIn == "true" ? <UserProfile /> : <UserSignIn />} />
                  <Route path="/profile" element={isLoggedIn == "true" ? <UserProfile /> : <UserSignIn />} />
                  <Route path="/prompts" element={isLoggedIn == "true" ? <UserPrompts /> : <UserSignIn />} />
                  <Route path="/forgot-password" element={isLoggedIn == "true" ? <UserProfile /> : <ForgotPassword />} />

                </Routes >
              </div>
            </div>
            <Footer />
          </div>
        </div>

      </BrowserRouter>

    </div>
  )
}

export default App