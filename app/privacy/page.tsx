import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16" style={{ backgroundColor: '#f5f8fa' }}>
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#00698f' }}>Privacy Policy - Learnitab</h1>
      <p className="effective-date mb-4" style={{ background: 'rgba(0,105,143,0.1)', padding: '0.5rem 1rem', borderRadius: '4px', fontStyle: 'italic' }}>
        Effective Date: 18 July 2024
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Introduction</h2>
      <p className="mb-4">
        Learnitab ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information when you use our browser extension Learnitab.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Information We Collect</h2>
      <p className="mb-4">We collect and store the following types of information:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>User-Provided Information: When you use Learnitab, you may be asked to provide your name for personalization purposes.</li>
        <li>Automatically Collected Information: We may automatically collect certain information about your interaction with the extension, such as preferences, settings, and background images. This includes:
          <ul className="list-disc ml-6">
            <li>Chrome storage data (e.g., userName, lastMode, backgroundImage, countdownList, iframeCache, todoList).</li>
          </ul>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>How We Use Your Information</h2>
      <p className="mb-4">We use the information we collect for the following purposes:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Personalization: To display your name and customize your experience with the extension.</li>
        <li>Storage and Preferences: To remember your settings and preferences for a seamless user experience.</li>
        <li>Functionality: To support the features of the extension such as background images, countdowns, and to-do lists.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Information Sharing and Disclosure</h2>
      <p className="mb-4">We do not share your personal information with third parties except in the following circumstances:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>With your consent.</li>
        <li>For legal reasons: If we believe it is necessary to comply with a legal obligation or to protect our rights, property, or safety or that of others.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Data Security</h2>
      <p className="mb-4">We implement reasonable security measures to protect your data. However, no method of transmission over the internet or method of electronic storage is completely secure. Therefore, we cannot guarantee its absolute security.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Your Choices</h2>
      <p className="mb-4">You can choose not to provide certain information, although this may affect the functionality of the extension. You can also manage and delete your data through the settings in the Learnitab extension.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Changes to This Privacy Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Effective Date" at the top of this policy. We encourage you to review this policy periodically to stay informed about how we are protecting your information.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Contact Us</h2>
      <div className="contact-info mb-4" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid rgba(0,105,143,0.2)' }}>
        <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
        <ul className="list-disc ml-6">
          <li>Email: <a href="mailto:learnitab@gmail.com" className="text-blue-500">learnitab@gmail.com</a></li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ color: '#00698f' }}>Permissions Notice:</h2>
      <p className="mb-4">We request the following permissions:</p>
      <ul className="permissions-list list-disc ml-6 mb-4">
        <li>storage: To save user preferences and settings.</li>
        <li>declarativeNetRequestWithHostAccess: To manage network requests for specified host permissions.</li>
        <li>sidePanel: To provide a side panel with additional features.</li>
        <li>fileSystem: To handle file operations within the extension.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#00698f' }}>Geolocation Permissions</h3>
      <p className="mb-4">Our website may request access to your device's geolocation data to provide weather information based on your current location. Please note the following about how we handle this information:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Your location data is only used to display relevant weather information</li>
        <li>We do not collect, store, or save your location data on our servers</li>
        <li>Your location information remains strictly on your browser</li>
        <li>You can deny or revoke this permission at any time through your browser settings</li>
      </ul>
      <p className="mb-4">When you grant geolocation permission, this is processed locally within your browser to enhance your experience with our weather feature. We respect your privacy and do not track or monitor your location beyond the immediate use of providing weather information.</p>

      <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#00698f' }}>Embedded YouTube Videos</h3>
      <p className="mb-4">Our website may contain embedded YouTube videos. These videos are hosted by YouTube, a service owned by Google LLC.</p>
      <p className="mb-4">We embed these videos in accordance with YouTube's Terms of Service. YouTube allows for the embedding of videos when:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>The video uploader has enabled the embedding feature</li>
        <li>We use YouTube's official embedding functionality</li>
        <li>The videos are displayed through the standard YouTube interface</li>
      </ul>
      <p className="mb-4">When you view pages containing embedded YouTube videos, your browser establishes a direct connection to YouTube's servers. YouTube may collect information about you, including:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Your IP address</li>
        <li>Browser type and settings</li>
        <li>The date and time of your visit</li>
        <li>Information stored in cookies</li>
      </ul>
      <p className="mb-4">For more information about how YouTube handles user data, please review <a href="https://policies.google.com/privacy" target="_blank" className="text-blue-500">Google's Privacy Policy</a>.</p>

      <div className="footer-note mt-8 mb-4" style={{ background: 'rgba(0,105,143,0.05)', padding: '2rem', borderRadius: '8px', textAlign: 'center', fontStyle: 'italic' }}>
        <p>By using Learnitab, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and sharing of your information as described herein.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
