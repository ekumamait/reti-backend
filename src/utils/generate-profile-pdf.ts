import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { ProfileDto } from 'src/profile/dto/profile.dto';

export async function generateProfilePDF(profile: ProfileDto): Promise<string> {
  const tempDir = path.join(__dirname, '../../temp');
  // if (!fs.existsSync(tempDir)) {
  //   fs.mkdirSync(tempDir, { recursive: true });
  // }

  const filePath = path.join(tempDir, `profile-${Date.now()}.pdf`);
  const stream = fs.createWriteStream(filePath);
  const doc = new PDFDocument();
  doc.pipe(stream);

  doc.fontSize(18).text('Applicant Profile', { align: 'center' }).moveDown();

  function addSection(title: string, content: string) {
    doc.fontSize(14).text(title, { underline: true }).moveDown(0.3);
    doc
      .fontSize(12)
      .text(content || 'N/A')
      .moveDown();
  }

  addSection('Profile Image', profile.profileImage || 'N/A');
  addSection('Is RETI Candidate', profile.isRetiCandidate ? 'Yes' : 'No');
  addSection('Bio', profile.bio || 'N/A');
  addSection('Location', profile.location || 'N/A');
  addSection('Email', profile.email || 'N/A');
  addSection('Phone Number', profile.phoneNumber || 'N/A');
  addSection('RETI Partner', profile.retiPartner);

  if (profile.skills && profile.skills.length > 0) {
    addSection('Skills', profile.skills.join(', '));
  }

  if (profile.stakeholderLinks) {
    addSection(
      'Mentors',
      profile.stakeholderLinks.mentors?.join(', ') || 'N/A',
    );
    addSection(
      'Employers',
      profile.stakeholderLinks.employers?.join(', ') || 'N/A',
    );
  }

  function addObjectSection(title: string, obj: any) {
    if (obj) {
      doc.fontSize(14).text(title, { underline: true }).moveDown(0.3);
      Object.entries(obj).forEach(([key, value]) => {
        doc
          .fontSize(12)
          .text(`${key}: ${value || 'N/A'}`)
          .moveDown(0.2);
      });
    }
  }

  addObjectSection('Skills & Training', profile.skillsAndTraining);
  addObjectSection('Artisan Details', profile.artisanDetails);
  addObjectSection('Geo-Location Details', profile.geoLocationDetails);
  addObjectSection('Participant Details', profile.participantDetails);
  addObjectSection('Training Centre Details', profile.trainingCentreDetails);
  addObjectSection('Training Cohorts', profile.trainingCohorts);
  addObjectSection('RETI Training Details', profile.retiTrainingDetails);
  addObjectSection(
    'Internship & Startup Details',
    profile.internshipAndStartupDetails,
  );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
