import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// Data Interfaces
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  dateOfBirth: string;
  country: string;
  state: string;
  genderIdentity: string;
  genderOther: string;
  yearLevel: string;
  raceEthnicity: string;
  raceOther: string;
  levelOfStudy: string;
  studyOther: string;
  fieldOfStudy: string;
  fieldOther: string;
  school: string;
  schoolOther: string;
  pantherID: string;
  linkedin: string;
  github: string;
  website: string;
  discord: string;
  foodAllergies: string[];
  shirtSize: string;
  codeOfConduct: boolean;
  photographyConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const countries = ['United States', 'Chile', 'Argentina', 'Peru', 'Mexico', 'Colombia', 'Brazil', 'Other'];
const states = ['Florida', 'California', 'Texas', 'New York', 'Illinois', 'Other'];
const schools = [
  'Florida International University',
  'University of Miami',
  'Miami Dade College',
  'Other',
];
const yearLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const genderOptions = ['Woman', 'Man', 'Non-binary', 'Other'];
const allergyOptions = ['Peanuts', 'Shellfish', 'Dairy', 'Gluten'];
const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    dateOfBirth: '',
    country: '',
    state: '',
    genderIdentity: '',
    genderOther: '',
    yearLevel: '',
    raceEthnicity: '',
    raceOther: '',
    levelOfStudy: '',
    studyOther: '',
    fieldOfStudy: '',
    fieldOther: '',
    school: '',
    schoolOther: '',
    pantherID: '',
    linkedin: '',
    github: '',
    website: '',
    discord: '',
    foodAllergies: [],
    shirtSize: '',
    codeOfConduct: false,
    photographyConsent: false
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof FormData, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const validateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const conferenceDate = new Date('2026-03-27');
    let age = conferenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = conferenceDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && conferenceDate.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const validatePantherID = (id: string) => {
    if (!/^\d{7}$/.test(id)) return false;
    const invalidIDs = ['0000000','1111111','2222222','3333333','4444444','5555555','6666666','7777777','8888888','9999999','1234567'];
    return !invalidIDs.includes(id);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.confirmEmail) newErrors.confirmEmail = 'Required';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!formData.password) newErrors.password = 'Required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Required';
    else if (!validateAge(formData.dateOfBirth)) newErrors.dateOfBirth = 'Must be 18 or older by March 27, 2026';
    if (!formData.country) newErrors.country = 'Required';
    if (formData.country === 'United States' && !formData.state) newErrors.state = 'Required';
    if (!formData.genderIdentity) newErrors.genderIdentity = 'Required';
    if (!formData.raceEthnicity) newErrors.raceEthnicity = 'Required';
    if (!formData.levelOfStudy) newErrors.levelOfStudy = 'Required';
    if (formData.levelOfStudy === 'Undergraduate' && !formData.yearLevel) newErrors.yearLevel = 'Required';
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Required';
    if (!formData.school) newErrors.school = 'Required';
    if (formData.school === 'Florida International University' && !formData.pantherID) newErrors.pantherID = 'Required';
    if (formData.school === 'Florida International University' && formData.pantherID && !validatePantherID(formData.pantherID)) newErrors.pantherID = 'Invalid Panther ID';
    if (!resumeFile) newErrors.resume = 'Required';
    if (!formData.shirtSize) newErrors.shirtSize = 'Required';
    if (!formData.codeOfConduct) newErrors.codeOfConduct = 'Required';
    if (!formData.photographyConsent) newErrors.photographyConsent = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    const url = "https://witcon.duckdns.org/backend-api/attendees/";
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach(item => fd.append(k, item));
      } else {
        fd.append(k, v.toString());
      }
    });
    if (resumeFile) fd.append('resume', resumeFile);

    try {
      const res = await fetch(url, { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

if (isSubmitted) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Registration Successful!</h2>
      <div className="bg-white border rounded p-4">
        <p>Thank you for registering for WiTCON 2025!</p>
        <p>A confirmation email has been sent to {formData.email}.</p>
      </div>
    </section>
  );
}

return (
  <section className="space-y-4">
    <h2 className="text-2xl font-bold">Registration</h2>
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* First Name */}
      <div>
        <label htmlFor="firstName">First Name *</label>
        <input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.firstName && <div className="text-red-600 text-sm">{errors.firstName}</div>}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName">Last Name *</label>
        <input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.lastName && <div className="text-red-600 text-sm">{errors.lastName}</div>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
      </div>

      {/* Confirm Email */}
      <div>
        <label htmlFor="confirmEmail">Confirm Email *</label>
        <input
          id="confirmEmail"
          type="email"
          value={formData.confirmEmail}
          onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.confirmEmail && <div className="text-red-600 text-sm">{errors.confirmEmail}</div>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password *</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth"> Date of birth *</label>
        <input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <div className="text-sm text-gray-600">Must be 18 or older by March 27, 2026</div>
        {errors.dateOfBirth && <div className="text-red-600 text-sm">{errors.dateOfBirth}</div>}
      </div>

    {/* Country */}
        <div>
          <label htmlFor="country">Country *</label>
          <select
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <div className="text-red-600 text-sm">{errors.country}</div>}
        </div>

    {/* State */}
    {formData.country === 'United States' && (
    <div>
        <label htmlFor="state">State *</label>
        <select
          id="state"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select state</option>
          {states.map((s) => (
           <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.state && <div className="text-red-600 text-sm">{errors.state}</div>}
    </div>
    )}

    {/* School */}
    <div>
      <label htmlFor="school">School *</label>
    <select
        id="school"
        value={formData.school}
        onChange={(e) => handleInputChange('school', e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
    >
        <option value="">Select school</option>
        {schools.map((s) => (
        <option key={s} value={s}>{s}</option>
        ))}
    </select>
    {errors.school && <div className="text-red-600 text-sm">{errors.school}</div>}
    </div>

    {/* Panther ID */}
    {formData.school === 'Florida International University' && (
    <div>
        <label htmlFor="pantherID">Panther ID *</label>
        <input
        id="pantherID"
        type="text"
        value={formData.pantherID}
        onChange={(e) => handleInputChange('pantherID', e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
        />
        {errors.pantherID && <div className="text-red-600 text-sm">{errors.pantherID}</div>}
    </div>
    )}

    {/* School Other */}
    {formData.school === 'Other' && (
    <div>
        <label htmlFor="schoolOther">Please specify your school *</label>
        <input
        id="schoolOther"
        type="text"
        value={formData.schoolOther}
        onChange={(e) => handleInputChange('schoolOther', e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
        />
        {errors.schoolOther && <div className="text-red-600 text-sm">{errors.schoolOther}</div>}
    </div>
    )}
      

    {/* Gender Identity */}
      <div>
        <label htmlFor="genderIdentity">Gender Identity *</label>
        <select
          id="genderIdentity"
          value={formData.genderIdentity}
          onChange={(e) => handleInputChange('genderIdentity', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select gender identity</option>
          {genderOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.genderIdentity && <div className="text-red-600 text-sm">{errors.genderIdentity}</div>}
      </div>

      {/* Year Level */}
      <div>
        <label htmlFor="yearLevel">Year Level *</label>
        <select
          id="yearLevel"
          value={formData.yearLevel}
          onChange={(e) => handleInputChange('yearLevel', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select year level</option>
          {yearLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {errors.yearLevel && <div className="text-red-600 text-sm">{errors.yearLevel}</div>}
      </div>

      {/* Food Allergies */}
      <div>
        <label htmlFor="foodAllergies">Food Allergies (Optional)</label>
        <select
          id="foodAllergies"
          multiple
          value={formData.foodAllergies}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, opt => opt.value);
            handleMultiSelectChange('foodAllergies', selected);
          }}
          className="w-full border rounded px-3 py-2"
        >
          {allergyOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Add custom allergy"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault();
              const newAllergy = e.currentTarget.value.trim();
              if (!formData.foodAllergies.includes(newAllergy)) {
                handleMultiSelectChange('foodAllergies', [...formData.foodAllergies, newAllergy]);
              }
              e.currentTarget.value = '';
            }
          }}
          className="w-full border rounded px-3 py-2 mt-2"
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label htmlFor="resume">Resume *</label>
        <input
          id="resume"
          type="file"
          onChange={handleFileChange}
          className="w-full border rounded px-3 py-2"
          accept=".pdf,.doc,.docx"
          required
        />
        {errors.resume && <div className="text-red-600 text-sm">{errors.resume}</div>}
      </div>

      {/* Shirt Size */}
      <div>
        <label htmlFor="shirtSize">Shirt Size *</label>
        <select
          id="shirtSize"
          value={formData.shirtSize}
          onChange={(e) => handleInputChange('shirtSize', e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select size</option>
          {shirtSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        {errors.shirtSize && <div className="text-red-600 text-sm">{errors.shirtSize}</div>}
      </div>

      {/* Agreements */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.codeOfConduct}
            onChange={(e) => handleInputChange('codeOfConduct', e.target.checked)}
            className="mr-2 mt-1"
            required
          />
          <span>I agree to the Code of Conduct *</span>
        </label>
        {errors.codeOfConduct && <div className="text-red-600 text-sm">{errors.codeOfConduct}</div>}
      </div>

      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.photographyConsent}
            onChange={(e) => handleInputChange('photographyConsent', e.target.checked)}
            className="mr-2 mt-1"
            required
          />
          <span>I consent to being photographed during the event *</span>
        </label>
        {errors.photographyConsent && <div className="text-red-600 text-sm">{errors.photographyConsent}</div>}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </div>
    </form>
  </section>
)};
export default Register;
