import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Link } from '../Router';
import { Users, Mail, Phone, Globe, Youtube, Twitter, Facebook } from 'lucide-react';
import { api } from '../../lib/api';

export function AboutPage() {
  const defaults = [
    {
      name: "Dr. B. M. Sivaprasad",
      role: "CEO & Editor-in-Chief",
      qualification: "PhD (Journalism), MJMC, MBA",
      specialty: "Journalism Leadership",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
    },
    {
      name: "B. T. Vijay Kumar",
      role: "Andhra Pradesh Head",
      qualification: "MA",
      specialty: "Regional Affairs",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
      name: "S. Bhavesh",
      role: "Lead Developer",
      qualification: "B.Tech",
      specialty: "Technology & Innovation",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    }
  ];
  const [teamMembers, setTeamMembers] = React.useState(defaults);
  React.useEffect(() => {
    (async () => {
      try {
        const saved = await api.settings.get<any[]>('leadership_team');
        if (Array.isArray(saved) && saved.length === 3) setTeamMembers(saved);
      } catch {}
    })();
  }, []);

  const socialLinks = [
    {
      icon: Youtube,
      name: "YouTube",
      url: "www.youtube.com/@News4Us",
      fullUrl: "https://www.youtube.com/@News4Us"
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: "twitter.com/news_4us",
      fullUrl: "https://twitter.com/news_4us"
    },
    {
      icon: Facebook,
      name: "Facebook",
      url: "fb.com/news4us",
      fullUrl: "https://www.fb.com/news4us"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">About Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-gray-900 dark:text-white">About </span>
            <span className="text-red-600">News4Us</span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400">
            TRUTH IS OUR NATURE
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Our Mission</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
            News4Us Channel gives you the latest and most exclusive updates from Andhra Pradesh & Telangana. 
            We deliver accurate and timely information on regional politics, national and international events, 
            sports, entertainment, business, crime, movies, fashion trends, and devotional programs.
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We also bring you trade insights, stock market live updates, and cricket scores — all in one place. 
            For more updates, connect with us!
          </p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">Connect With Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <social.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">{social.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{social.url}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
            <a 
              href="mailto:newsforus.in@gmail.com" 
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              newsforus.in@gmail.com
            </a>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
            <a 
              href="tel:9059788886" 
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              9059788886
            </a>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Website</h3>
            <a 
              href="http://www.news4us.in/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              www.news4us.in
            </a>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-red-100 dark:border-red-900/20 group-hover:border-red-600 dark:group-hover:border-red-400 transition-colors shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-medium mb-2">{member.role}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">{member.qualification}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{member.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
