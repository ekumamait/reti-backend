import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Profile } from '../entities/profile.entity';

export default class CreateProfiles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingProfiles = await connection.getRepository(Profile).find();

    if (existingProfiles.length === 0) {
      const profiles: Partial<Profile>[] = Array.from(
        { length: 20 },
        (_, i) => ({
          userId: i + 1,
          profileImage: `https://example.com/profiles/user-${i + 1}.jpg`,
          skills: [
            'Communication',
            'Problem-Solving',
            'Teamwork',
            'Project Management',
          ],
          stakeholderLinks: {
            mentors: i % 3 === 0 ? ['mentor@example.com'] : [],
            employers: i % 4 === 0 ? ['employer@example.com'] : [],
          },
          bio: `User ${
            i + 1
          } is a dedicated professional with expertise in various domains.`,
          location: `City ${i + 1}, Country ${i + 1}`,
          email: `user${i + 1}@example.com`,
          dateOfBirth: new Date(`199${i % 10}-0${(i % 9) + 1}-15`),
          gender: i % 2 === 0 ? 'male' : 'female',
          theme: 'light',
          skillsAndTraining: {
            traineeCategory: 'Skilled but unemployed',
            trainingDuration: '6 months',
            trainingLocation: 'Urban Center',
          },
          artisanDetails: {
            categoryOfArtisan: 'Individual artisan',
            nameOfHost: `Host ${i + 1}`,
            villageOfArtisan: `Village ${i + 1}`,
            subcountyOfArtisan: `Subcounty ${i + 1}`,
            centerRefugeeSettlement: 'Bidibidi',
            hostContact: '+256789456123',
          },
          geoLocationDetails: {
            partnerResponsible: 'Dan Church Aid (DCA)',
            region: 'Northern',
            district: `District ${i + 1}`,
            settlement: `Settlement ${i + 1}`,
            subCounty: `SubCounty ${i + 1}`,
            parishZoneCluster: `Zone ${i % 3}`,
            village: `Village ${i + 1}`,
          },
          participantDetails: {
            nameOfParticipant: `User ${i + 1}`,
            groupNumber: `DLL-18H12${i + 1}`,
            individualNumber: `DLL-00012${i + 1}`,
            nin: `CM9104011${i}CFRD`,
            sex: i % 2 === 0 ? 'Male' : 'Female',
            age: `${20 + (i % 10)}`,
            maritalStatus: 'Single',
            specialInterestCategory: 'None',
            disabilityType: 'None',
            numberOfDisabilities: 'None',
            mainDisabilityDetails: 'None',
            nationalityCategory: 'Local Citizen',
            uniqueIdNo: `DCA/YUM/YR1/00${i + 1}`,
          },
          trainingCentreDetails: {
            nameOfTrainingCentre: `Training Centre ${i + 1}`,
            locationVillage: `Village ${i + 1}`,
            locationSubCounty: `SubCounty ${i + 1}`,
            locationSettlement: 'Bidibidi',
            mainTelephoneContact: `+2567059992${i + 1}`,
            alternativeTelephoneContact: `+2567059993${i + 1}`,
          },
          trainingCohorts: {
            cohort: `Cohort ${i % 5}`,
            tradeTakenDuringTraining: i % 2 === 0 ? 'Tailoring' : 'Carpentry',
          },
          retiTrainingDetails: {
            startTime: new Date('2023-05-15'),
            completionStatus: i % 2 === 0 ? 'Completed' : 'Ongoing',
            reasonForDroppingOut: i % 5 === 0 ? 'Personal reasons' : '',
            monthsSpent: '3',
            certificationStatus: 'Certified by DIT',
          },
          internshipAndStartupDetails: {
            completionTime: new Date('2024-05-15'),
            internshipPlacement: 'Currently on internship',
            startupKitReceived: 'Yes',
            startupGrantReceived: 'Yes',
          },
        }),
      );

      await connection
        .createQueryBuilder()
        .insert()
        .into(Profile)
        .values(profiles)
        .execute();
    }
  }
}
