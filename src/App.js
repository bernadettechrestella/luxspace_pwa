import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import Browse from './components/Browse';
import Arrived from './components/Arrived';
import Clients from './components/Clients';
import AsideMenu from './components/AsideMenu';
import Footer from './components/Footer';
import Offline from './components/Offline';
import Splash from './pages/Splash';
import Profile from './pages/Profile.js';
import Details from './components/Details';

function App() {
  const [items, setItems] = React.useState([]);

  //menampung status offline online
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);

  //splashscreen
  const [isLoading, setIsLoading] = React.useState(true);

  function handleOfflineStatus() {
    setOfflineStatus(!navigator.onLine);
  }

  //Pertama kali web di buka, api akan di load
  React.useEffect(function() {
    (async function() {
      const response = await fetch('https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc', {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-api-key": process.env.REACT_APP_APIKEY
        }
      });
      const { nodes } = await response.json();
      setItems(nodes);

      //load carousel.js
      const script = document.createElement("script");
      script.src = "/carousel.js"
      script.async = false;
      document.body.appendChild(script);
    })();

    handleOfflineStatus();
    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    //timeout splashscreen
    setTimeout(function() {
      setIsLoading()
    }, 1500);

    return function() {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    }
  }, [offlineStatus]);

  return (
    <>
      {isLoading === true ? <Splash /> : 
      (
        <>
          {offlineStatus && <Offline />}
          <Header />
          <Hero />
          <Browse />
          <Arrived items={items}/>
          <Clients />
          <AsideMenu />
          <Footer />
        </>
      )}
    </>
  );
}

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  )
}
