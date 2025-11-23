import React, { useState } from 'react';
import {useEffect} from 'react';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
//import { Camera, Edit, X, FileText, ExternalLink } from 'lucide-react';
import Title from '../components/text/Title';
import { useAuth } from '../context/AuthContext';

interface AttendeeData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  schoolOther?: string;
  fieldOfStudy: string;
  levelOfStudy: string;
  yearLevel?: string;
  resume?: string;
  resume_name?: string;
  resume_url?: string;
  resume_replacement_count?: number;
  resume_replacements_remaining?: number;
  linkedin?: string;
  github?: string;
  discord?: string;
  profileImage?: string;
  shirtSize?: string;
}

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId, userEmail, login, logout } = useAuth();
  const [_isEditing, setIsEditing] = useState<boolean>(false);
  const [_showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [_showResumeViewer, _setShowResumeViewer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Get email from URL params (from OAuth redirect)
  const emailFromUrl = searchParams.get('email');

  const [attendeeData, setAttendeeData] = useState<AttendeeData>({
    firstName: 'Ariana',
    lastName: 'De las Casas',
    email: 'aricasa@gmail.com',
    school: 'Harvard University',
    fieldOfStudy: 'Computer Science',
    levelOfStudy: 'Undergraduate',
    discord: 'Ariana#1234',
    linkedin: 'linkedin.com/in/ariana-casas',
    github: 'github.com/ariana-casas',
  });


  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(attendeeData.profileImage || "profilePic1.png");
  const iconOptions = [
    "profilePic1.png",
    "profilePic2.png",
    "profilePic3.png",
    "profilePic4.png",
    "profilePic5.png",
    "profilePic6.png",
  ];

  const [editData, setEditData] = useState<AttendeeData>({ ...attendeeData });

  const API_URL = import.meta.env.VITE_API_URL ||
    ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8000/backend-api'
      : 'https://witcon.duckdns.org/backend-api');

  // Handle email from URL params (from OAuth redirect) - log user in if not already logged in
  useEffect(() => {
    if (emailFromUrl && !userId && !userEmail) {
      // Email in URL but user not logged in - fetch user data and log them in
      setLoading(true);
      fetch(`${API_URL}/attendees/by-email/?email=${encodeURIComponent(emailFromUrl)}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('User not found');
        })
        .then((data: AttendeeData) => {
          // Log the user in
          if (data.id && data.email) {
            login(data.id, data.email);
          }
          // Clean up URL by removing email parameter
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('email');
          const newUrl = window.location.pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : '');
          window.history.replaceState({}, '', newUrl);
        })
        .catch(err => {
          console.error('Failed to log in user from email:', err);
          setError('Failed to load profile. Please try logging in again.');
          setLoading(false);
        });
    }
  }, [emailFromUrl, userId, userEmail, login, API_URL, searchParams]);

  // Fetch attendee profile when userId or userEmail changes
  useEffect(() => {
    if (!userId && !userEmail) return; // don't fetch if no user logged in

    setLoading(true);
    
    // Use email-based endpoint if email is available
    // Else fall back to userId endpoint
    const fetchUrl = userEmail 
      ? `${API_URL}/attendees/by-email/?email=${encodeURIComponent(userEmail)}`
      : `${API_URL}/attendees/${userId}/`;
    
    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile data');
        return res.json();
      })
      .then((data: AttendeeData) => {
        setAttendeeData(data);
        setEditData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, userEmail, API_URL]);


  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...attendeeData });
  };


  const handleSave = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/attendees/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      const updated: AttendeeData = await res.json();
      setAttendeeData(updated);
      setIsEditing(false);
      console.log('Profile updated:', updated);
    } catch (err: any) {
      alert(err.message);
    }
  };


  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...attendeeData });
  };


  const handleInputChange = <K extends keyof AttendeeData>(field: K, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value } as AttendeeData));
  };


  const handleResumeUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (600 KB limit)
    if (file.size > 600 * 1024) {
      alert("Resume file size must be 600 KB or smaller");
      event.target.value = ''; // Reset file input
      return;
    }

    // Check if user has replacements remaining
    const replacementsRemaining = attendeeData.resume_replacements_remaining ?? 2;
    if (replacementsRemaining <= 0) {
      alert("You have reached the maximum number of resume replacements (2). You cannot replace your resume again.");
      event.target.value = ''; // Reset file input
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${API_URL}/attendees/${userId}/`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include', // Include cookies for session authentication
      });
      
      const responseData = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        console.error('Upload failed - Status:', res.status);
        console.error('Upload failed - Response:', responseData);
        const errorMessage = responseData.resume?.[0] || responseData.resume || responseData.error || responseData.detail || `Failed to upload resume (Status: ${res.status})`;
        throw new Error(errorMessage);
      }
      
      const updated: AttendeeData = await res.json();
      setAttendeeData(updated);
      alert(`Resume updated successfully! ${replacementsRemaining - 1} replacement${replacementsRemaining - 1 === 1 ? '' : 's'} remaining.`);
      console.log('Resume updated:', file.name);
    } catch (err: any) {
      console.error('Resume upload error:', err);
      alert(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      event.target.value = ''; // Reset file input
    }
  };


  const handleCheckIn = () => setShowQRScanner(true);
  const handleQRScan = () => {
    setShowQRScanner(false);
    alert('Check-in successful! Welcome to WiTCON 2025!');
  };


  const handleLogout = () => {
    logout(); // clears the userId in context
  };


  if (!userId && !userEmail) {
    return (
      <main className="w-full max-w-screen-xl mx-auto px-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Profile</h2>
          <div className="bg-white border rounded p-6 text-center space-y-4">
            <p>Please register to view your attendee profile.</p>
            <a href="/register" className="text-blue-600 hover:underline">
              Go to Registration
            </a>
          </div>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="w-full max-w-screen-xl mx-auto px-6">
        <section className="space-y-4">
          <p className="text-center py-8">Loading profile...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-screen-xl mx-auto px-6">
        <section className="space-y-4">
          <p className="text-red-600 text-center py-8">Error: {error}</p>
        </section>
      </main>
    );
  }

type InfoSectionProps = {
  children: React.ReactNode;
};

function InfoSection({ children }: InfoSectionProps) {
  return (
    <div className="break-inside-avoid mb-6 bg-[color:var(--color-tertiary-yellow)] p-6 rounded-xl space-y-4">
      {children}
    </div>
  );
}

const AcademicInfoBox = () => (
  <InfoSection>
    <div className="flex items-center gap-4">
      <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">Major:</label>
      <input
        type="text"
        value={attendeeData.fieldOfStudy || ""}
        readOnly
        className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] w-fit min-w-[150px]"
      />
    </div>

    <div className="flex items-center gap-4">
      <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">School:</label>
      <input
        type="text"
        value={attendeeData.school || attendeeData.schoolOther || ""}
        readOnly
        className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] w-fit min-w-[150px]"
      />
    </div>

    <div className="flex items-center gap-4">
      <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">Level of Study:</label>
      <input
        type="text"
        value={attendeeData.levelOfStudy || ""}
        readOnly
        className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] w-fit min-w-[150px]"
      />
    </div>
  </InfoSection>
);


const ResumeSocialBox = ({ attendeeData, handleResumeUpdate }: { attendeeData: AttendeeData; handleResumeUpdate: (event: ChangeEvent<HTMLInputElement>) => void }) => {
  const replacementsRemaining = attendeeData.resume_replacements_remaining ?? 2;
  const hasResume = !!attendeeData.resume_name;
  
  return (
    <InfoSection>
      {/* Resume Section */}
      <div className="space-y-3">
        {/* Always show replacement count message at the top */}
        <div className="bg-[#FFF6F6] rounded-full px-4 py-2 border-2 border-[color:var(--color-primary-pink)]">
          <p className={`text-sm text-[color:var(--color-primary-brown)] font-[Actor] text-center ${
            replacementsRemaining === 0 ? 'text-red-600 font-semibold' : 'font-medium'
          }`}>
            {replacementsRemaining > 0 
              ? `Resume Replacements Remaining: ${replacementsRemaining} of 2 (Max 600 KB per file)`
              : 'Resume Replacements Remaining: 0 of 2 (Maximum reached - no more replacements allowed)'
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          <img src="/images/pdfIcon.png" alt="PDF Icon" className="w-20 h-20" />
          <div className="flex-1">
            {hasResume ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">Resume:</label>
                  <p className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] truncate" title={attendeeData.resume_name}>
                    {attendeeData.resume_name}
                  </p>
                </div>
                {replacementsRemaining > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpdate}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="bg-[color:var(--color-secondary-yellow)] text-[color:var(--color-primary-pink)] px-4 py-2 rounded-full hover:bg-[color:var(--color-primary-yellow)] transition cursor-pointer text-sm font-medium"
                    >
                      Choose New File
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[color:var(--color-primary-brown)] font-[Actor] text-center w-full">
                No resume uploaded yet.
              </p>
            )}
          </div>
        </div>

        {!hasResume && replacementsRemaining > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="resume-upload-initial" className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">
              Upload Resume:
            </label>
            <input
              id="resume-upload-initial"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpdate}
              className="hidden"
            />
            <label
              htmlFor="resume-upload-initial"
              className="bg-[color:var(--color-secondary-yellow)] text-[color:var(--color-primary-pink)] px-4 py-2 rounded-full hover:bg-[color:var(--color-primary-yellow)] transition cursor-pointer text-sm font-medium"
            >
              Choose File
            </label>
          </div>
        )}
        {!hasResume && replacementsRemaining === 0 && (
          <p className="text-sm text-[color:var(--color-primary-brown)] font-[Actor] text-center w-full italic">
            You cannot upload or replace your resume at this time.
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">LinkedIn:</label>
      <input
        type="text"
        value={attendeeData.linkedin || ""}
        readOnly
        className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] w-fit min-w-[150px]"
      />
    </div>

    <div className="flex items-center gap-4">
      <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">GitHub:</label>
      <input
        type="text"
        value={attendeeData.github || ""}
        readOnly
        className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] w-fit min-w-[150px]"
      />
    </div>

    <div className="flex items-center gap-4">
      <label className="text-[color:var(--color-primary-brown)] font-medium min-w-[100px]">Discord Username:</label>
      <input
        type="text"
        value={attendeeData.discord || ""}
        readOnly
        className="flex-1 px-4 py-2 rounded-full bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor] w-fit min-w-[150px]"
      />
    </div>
  </InfoSection>
  );
};


const WiCSResourcesBox = () => (
  <InfoSection>
    <h3 className="font-semibold text-lg text-[color:var(--color-primary-brown)]">Make the best of WiTCON</h3>
    <div className="flex items-center gap-3">
      <img src="/images/notionIcon.png" alt="Notion Icon" className="w-8 h-8" />
      <a
        href="https://www.notion.so/WiTCON-2026-Attendee-Guide"
        target="_blank"
        className="w-full px-4 py-2 rounded-4xl bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor]"
      >
        WiTCON ‘26 Attendee Guide
      </a>
    </div>

    <div className="flex items-center gap-3">
      <img src="/images/discordIcon.png" alt="Discord Icon" className="w-8 h-8" />
      <a
        href="https://discord.gg/wicsfiu"
        target="_blank"
        className="w-full px-4 py-2 rounded-4xl bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor]"
      >
        WiCS Discord
      </a>
    </div>

    <div className="flex items-center gap-3">
      <img src="/images/linkedInIcon.png" alt="LinkedIn Icon" className="w-8 h-8" />
      <a
        href="https://www.linkedin.com/company/wicsatfiu/"
        target="_blank"
        className="w-full px-4 py-2 rounded-4xl bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor]"
      >
        WiCS LinkedIn
      </a>
    </div>

    <div className="flex items-center gap-3">
      <img src="/images/instagramIcon.png" alt="Instagram Icon" className="w-8 h-8" />
      <a
        href="https://instagram.com/wicsfiu"
        target="_blank"
        className="w-full px-4 py-2 rounded-4xl bg-[#FFF6F6] text-[color:var(--color-primary-brown)] font-[Actor]"
      >
        WiCS Instagram
      </a>
    </div>
  </InfoSection>
);


const ReportIncidentBox = () => (
  <InfoSection>
    <h3 className="font-semibold text-2xl text-[color:var(--color-primary-brown)]">REPORT AN INCIDENT</h3>
    <p className="text-sm text-[color:var(--color-primary-brown)]">
      Please, if you feel uncomfortable or witness inappropriate behavior at WiTCON. Please report it using the link below.
    </p>
    <a
      href="https://discord.gg/wicsfiu"
      target="_blank"
      className="inline-block bg-[color:var(--color-primary-pink)] text-[color:var(--color-tertiary-yellow)] px-4 py-2 rounded-full hover:bg-pink-700 transition"
    >
      REPORT
    </a>
  </InfoSection>
);




return (
  <main className="w-full max-w-screen-xl mx-auto px-6">
  <section className="mb-2">
    {/* Profile Header */}
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 rounded-full border-6 border-[color:var(--color-primary-pink)] overflow-hidden">
          <img
            src={`/images/${selectedImage}`}
            alt="Profile Icon"
            className="w-full h-full object-cover"
          />
        </div>
       
        <div className="flex flex-col items-start justify-center">
          <Title className="font-bold"> {attendeeData.firstName} {attendeeData.lastName}
          </Title>
          <div className="flex gap-3 mt-3">
          <div className="relative">
            <button
              onClick={() => setShowIconPicker(true)}
              className="bg-[color:var(--color-secondary-yellow)] text-[color:var(--color-primary-pink)] px-3 py-1 rounded-full hover:bg-[color:var(--color-primary-yellow)] transition"
            >
              Change Icon
            </button>


            {showIconPicker && (
            <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 bg-white border border-[color:var(--color-primary-pink)] rounded-xl shadow-lg p-4 grid grid-cols-3 gap-4">
              {iconOptions.map((img, i) => (
                <img
                  key={i}
                  src={`/images/${img}`}
                  alt={`Icon ${i + 1}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-transparent hover:border-4 hover:border-[color:var(--color-primary-pink)]"
                  onClick={() => {
                      setSelectedImage(img);
                      setShowIconPicker(false);
                  }}
                />
              ))}
            </div>
            )}
          </div>


            <button
              onClick={handleCheckIn}
              className="bg-[color:var(--color-secondary-yellow)] text-[color:var(--color-primary-pink)] px-3 py-1 rounded-full hover:bg-[color:var(--color-primary-yellow)] transition"
            >
              Check In
            </button>
          </div>
        </div>
      </div>


      {/* Right: Edit Button */}
      <button onClick={handleEdit} className="mt-4 md:mt-0">
        <img
          src="/images/editIcon.png"
          alt="Edit"
          className="w-12 h-12 hover:scale-105 transition-transform"
        />
      </button>
    </div>
    </section>


    <section>
    <div className="columns-1 md:columns-2 gap-6 mt-2">
          <AcademicInfoBox />
          <WiCSResourcesBox />
          <ResumeSocialBox attendeeData={attendeeData} handleResumeUpdate={handleResumeUpdate} />
          <ReportIncidentBox />
    </div>
  </section>
  </main>
);
}    