const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');

dotenv.config();

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentnest');
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    console.log('🧹 Purged existing Users and Properties');

    // 1. Create Users
    const tenantUser = await User.create({
      name: 'Priya Mehta',
      phone: '+919876543201',
      email: 'priya.mehta@example.com',
      role: 'tenant',
      isPhoneVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    });

    const ownerUser = await User.create({
      name: 'Jayeshbhai Patel',
      phone: '+919876543202',
      email: 'jayesh.patel@example.com',
      role: 'owner',
      isPhoneVerified: true,
      verificationStatus: 'verified',
      kycDocumentType: 'electricity_bill',
      kycVerifiedAt: new Date(),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    });

    const brokerUser = await User.create({
      name: 'Rajkot Prime Realty (Kishan Dabhi)',
      phone: '+919876543203',
      email: 'kishan@rajkotprime.in',
      role: 'broker',
      isPhoneVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      brokerDetails: {
        agencyName: 'Rajkot Prime Realty Pvt Ltd',
        brokerageTerms: '15 Days Rent',
        experienceYears: 8
      }
    });

    const adminUser = await User.create({
      name: 'RentNest Operations Admin',
      phone: '+919876543204',
      email: 'admin@rentnest.in',
      role: 'admin',
      isPhoneVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });

    console.log('👤 Created Seed Users (Tenant, Verified Owner, Broker, Admin)');

    // 2. Realistic Rajkot Property Seed Listings
    const sampleProperties = [
      {
        title: 'Spacious 2 BHK Garden Facing Flat in Radhika Heights',
        owner: ownerUser._id,
        isVerifiedOwner: true,
        propertyType: 'flat',
        bhk: '2 BHK',
        carpetAreaSqFt: 1150,
        floorNumber: 4,
        totalFloors: 11,
        facing: 'East',
        locality: 'Kalawad Road',
        societyName: 'Radhika Heights',
        fullAddress: 'Flat 402, Radhika Heights, Opposite Cosmoplex Cinema, Kalawad Road, Rajkot',
        landmark: 'Near Cosmoplex Cinema & Crystal Mall',
        distanceToKeyLandmarks: [
          { name: 'Crystal Mall', distanceKm: 1.2 },
          { name: 'Cosmoplex Cinema', distanceKm: 0.3 },
          { name: 'BRTS Stop', distanceKm: 0.5 }
        ],
        coordinates: { lat: 22.2885, lng: 70.7681 },
        pricing: {
          monthlyRent: 16500,
          securityDeposit: 33000,
          depositMonths: 2,
          maintenanceAmount: 1500,
          isMaintenanceIncluded: false,
          brokerageAmount: 0, // Direct Owner
          lockInPeriodMonths: 6,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Continuous Pressure',
          waterSource: ['Municipal RMC/Narmada', 'Borewell'],
          drinkingWaterRo: true,
          pipedGasAvailable: true,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Family Only',
          foodPreference: 'Pure Vegetarian Only',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Semi-Furnished',
        furnishingItems: ['Modular Kitchen', 'Geyser in 2 Baths', 'Wardrobes', 'Curtain Rods', 'Fans & Tube Lights'],
        amenities: ['Covered 4W Parking', 'Dual Lifts with DG Backup', 'CCTV Security Guard', 'Balcony', 'Children Play Area'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Master Bedroom',
            isCoverPhoto: false
          },
          {
            url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Kitchen',
            isCoverPhoto: false
          },
          {
            url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Balcony',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Modern Furnished 3 BHK in Orchid Harmony with Adani PNG',
        owner: ownerUser._id,
        isVerifiedOwner: true,
        propertyType: 'flat',
        bhk: '3 BHK',
        carpetAreaSqFt: 1550,
        floorNumber: 7,
        totalFloors: 14,
        facing: 'North-East',
        locality: '150 Ft Ring Road',
        societyName: 'Orchid Harmony',
        fullAddress: 'A-701, Orchid Harmony, Near Balaji Hall, 150 Ft Ring Road, Rajkot',
        landmark: 'Opposite Big Bazaar / Balaji Hall',
        distanceToKeyLandmarks: [
          { name: 'Balaji Hall', distanceKm: 0.2 },
          { name: 'Raiya Telephone Exchange', distanceKm: 1.5 }
        ],
        coordinates: { lat: 22.2831, lng: 70.7812 },
        pricing: {
          monthlyRent: 24000,
          securityDeposit: 48000,
          depositMonths: 2,
          maintenanceAmount: 2000,
          isMaintenanceIncluded: false,
          brokerageAmount: 0,
          lockInPeriodMonths: 11,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Municipal Line',
          waterSource: ['Municipal RMC/Narmada'],
          drinkingWaterRo: true,
          pipedGasAvailable: true,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Family Only',
          foodPreference: 'Pure Vegetarian Only',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Fully Furnished',
        furnishingItems: ['3 AC Units', 'Double Beds with Mattresses', 'Sofa Set 3+2', 'Dining Table 6-Seater', 'Refrigerator', 'Washing Machine', 'Smart LED TV'],
        amenities: ['Covered 4W Parking', 'High Speed Lifts', 'Clubhouse & Gym', 'Terrace Garden', 'Adani Gas Pipeline'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Master Bedroom',
            isCoverPhoto: false
          },
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Exterior / Entrance',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Budget 1 BHK Near Saurashtra University (Bachelor Friendly)',
        owner: brokerUser._id,
        isVerifiedOwner: false,
        propertyType: 'flat',
        bhk: '1 BHK',
        carpetAreaSqFt: 620,
        floorNumber: 2,
        totalFloors: 4,
        facing: 'East',
        locality: 'University Road',
        societyName: 'Shiv Shakti Apartments',
        fullAddress: 'Block B-203, Shiv Shakti Apartments, Near Akashwani Chowk, University Road, Rajkot',
        landmark: 'Near Saurashtra University Main Gate',
        distanceToKeyLandmarks: [
          { name: 'Saurashtra University', distanceKm: 0.8 },
          { name: 'Akashwani Chowk', distanceKm: 0.4 },
          { name: 'Kotecha Chowk', distanceKm: 2.1 }
        ],
        coordinates: { lat: 22.3012, lng: 70.7725 },
        pricing: {
          monthlyRent: 8500,
          securityDeposit: 17000,
          depositMonths: 2,
          maintenanceAmount: 600,
          isMaintenanceIncluded: true,
          brokerageAmount: 4250, // 15 days brokerage by agent
          lockInPeriodMonths: 3,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'sub_meter',
          subMeterUnitRate: 9, // ₹9/unit submeter
          waterSupplyType: 'scheduled_municipal',
          waterScheduleHours: 'Morning 7:00 AM - 8:30 AM & Evening 6:00 PM - 7:00 PM',
          waterSource: ['Municipal RMC/Narmada', 'Borewell'],
          drinkingWaterRo: true,
          pipedGasAvailable: false,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Any',
          foodPreference: 'Vegetarian / Jain Preferred',
          gateCurfew: 'Gate Locked at 11:00 PM',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Semi-Furnished',
        furnishingItems: ['Single Beds (2)', 'Ceiling Fans', 'Study Table', 'Kitchen Counter'],
        amenities: ['2-Wheeler Parking Only', 'Water Tank Storage', 'Balcony'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Bedroom',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Luxury 4 BHK Penthouse with Private Terrace in Nana Mava',
        owner: ownerUser._id,
        isVerifiedOwner: true,
        propertyType: 'penthouse',
        bhk: '4+ BHK',
        carpetAreaSqFt: 2800,
        floorNumber: 12,
        totalFloors: 12,
        facing: 'East',
        locality: 'Nana Mava',
        societyName: 'Shivalik Sky Villas',
        fullAddress: 'Penthouse 1201, Shivalik Sky Villas, Speedwell Party Plot Road, Nana Mava, Rajkot',
        landmark: 'Near Speedwell Party Plot',
        distanceToKeyLandmarks: [
          { name: 'Mavdi Chowkdi', distanceKm: 1.8 },
          { name: 'Kalawad Road', distanceKm: 2.5 }
        ],
        coordinates: { lat: 22.2718, lng: 70.7854 },
        pricing: {
          monthlyRent: 42000,
          securityDeposit: 84000,
          depositMonths: 2,
          maintenanceAmount: 3500,
          isMaintenanceIncluded: false,
          brokerageAmount: 0,
          lockInPeriodMonths: 12,
          noticePeriodDays: 60
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Pressurized System',
          waterSource: ['Municipal RMC/Narmada', 'Borewell'],
          drinkingWaterRo: true,
          pipedGasAvailable: true,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Family Only',
          foodPreference: 'Pure Vegetarian Only',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: true
        },
        furnishingStatus: 'Fully Furnished',
        furnishingItems: ['Italian Modular Kitchen', 'Central VRV Air Conditioning', 'Designer Wooden Wardrobes', 'Jacuzzi in Master Bath', 'Smart Home Lighting'],
        amenities: ['Private Rooftop Terrace', '2 Reserved 4W Covered Parkings', 'Infinity Pool on Terrace', 'Clubhouse & Banquet', '24/7 Security & Video Intercom'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Exterior / Entrance',
            isCoverPhoto: false
          },
          {
            url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Master Bedroom',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Brand New 2 BHK Flat in Aalap Green City Corridor, Raiya Road',
        owner: ownerUser._id,
        isVerifiedOwner: true,
        propertyType: 'flat',
        bhk: '2 BHK',
        carpetAreaSqFt: 1080,
        floorNumber: 5,
        totalFloors: 9,
        facing: 'North',
        locality: 'Raiya Road',
        societyName: 'Aalap Heights',
        fullAddress: 'Flat 503, Aalap Heights, Raiya Road, Near Aalap Green City, Rajkot',
        landmark: 'Opposite Raiya Gam Lake',
        distanceToKeyLandmarks: [
          { name: 'AIIMS Rajkot Transit Road', distanceKm: 4.5 },
          { name: 'Race Course Ground', distanceKm: 3.2 }
        ],
        coordinates: { lat: 22.3125, lng: 70.7654 },
        pricing: {
          monthlyRent: 14500,
          securityDeposit: 29000,
          depositMonths: 2,
          maintenanceAmount: 1200,
          isMaintenanceIncluded: false,
          brokerageAmount: 0,
          lockInPeriodMonths: 6,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Municipal Water',
          waterSource: ['Municipal RMC/Narmada'],
          drinkingWaterRo: true,
          pipedGasAvailable: true,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Family Only',
          foodPreference: 'Pure Vegetarian Only',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Semi-Furnished',
        furnishingItems: ['Modular Kitchen Trolleys', 'Geyser', 'Curtains', 'Fans & LED Lights'],
        amenities: ['Covered 4W Car Parking', 'Automatic Lift', 'CCTV Security Guard', 'Balcony'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Master Bedroom',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Independent 3 BHK Bungalow with Private Parking in Sadhu Vaswani Road',
        owner: ownerUser._id,
        isVerifiedOwner: true,
        propertyType: 'independent_house',
        bhk: '3 BHK',
        carpetAreaSqFt: 1850,
        floorNumber: 0,
        totalFloors: 2,
        facing: 'East',
        locality: 'Sadhu Vaswani Road',
        societyName: 'Vardhman Nagar Society',
        fullAddress: 'Plot 28, Vardhman Nagar, Behind Reliance Mall, Sadhu Vaswani Road, Rajkot',
        landmark: 'Behind Reliance Smart Mall',
        distanceToKeyLandmarks: [
          { name: 'Reliance Smart Mall', distanceKm: 0.4 },
          { name: 'Jagnaath Marble Circle', distanceKm: 0.9 }
        ],
        coordinates: { lat: 22.3089, lng: 70.7819 },
        pricing: {
          monthlyRent: 26000,
          securityDeposit: 52000,
          depositMonths: 2,
          maintenanceAmount: 0, // Independent house, zero society fee
          isMaintenanceIncluded: true,
          brokerageAmount: 0,
          lockInPeriodMonths: 11,
          noticePeriodDays: 45
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: 'Dedicated 5000L Underground & Overhead Tank',
          waterSource: ['Municipal RMC/Narmada', 'Borewell'],
          drinkingWaterRo: true,
          pipedGasAvailable: true,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Family Only',
          foodPreference: 'Pure Vegetarian Only',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Semi-Furnished',
        furnishingItems: ['Wooden Wardrobes in All 3 Bedrooms', 'Complete Kitchen Cabinetry', 'Fans & Chandelier'],
        amenities: ['Private Covered Driveway Parking (2 Cars)', 'Private Rooftop Terrace', 'Small Front Garden', 'Separate Servant/Store Room'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Exterior / Entrance',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Clean 1 RK Studio Apartment for Working Professional in Mavdi',
        owner: brokerUser._id,
        isVerifiedOwner: false,
        propertyType: 'flat',
        bhk: '1 RK',
        carpetAreaSqFt: 380,
        floorNumber: 3,
        totalFloors: 5,
        facing: 'West',
        locality: 'Mavdi',
        societyName: 'Mavdi Landmark Plaza',
        fullAddress: 'Flat 308, Mavdi Landmark Plaza, Near Mavdi Chowkdi, Rajkot',
        landmark: 'Near Mavdi Chowkdi BRTS stop',
        distanceToKeyLandmarks: [
          { name: 'Mavdi Chowkdi BRTS', distanceKm: 0.3 },
          { name: 'Gondal Road Circle', distanceKm: 2.2 }
        ],
        coordinates: { lat: 22.2618, lng: 70.7925 },
        pricing: {
          monthlyRent: 6000,
          securityDeposit: 12000,
          depositMonths: 2,
          maintenanceAmount: 500,
          isMaintenanceIncluded: false,
          brokerageAmount: 3000,
          lockInPeriodMonths: 6,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'sub_meter',
          subMeterUnitRate: 9.5,
          waterSupplyType: 'scheduled_municipal',
          waterScheduleHours: 'Morning 6:30 AM - 8:00 AM',
          waterSource: ['Municipal RMC/Narmada'],
          drinkingWaterRo: true,
          pipedGasAvailable: false,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Working Professionals Only',
          foodPreference: 'Vegetarian / Jain Preferred',
          gateCurfew: 'Gate Locked at 11:00 PM',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Semi-Furnished',
        furnishingItems: ['Single Bed', 'Wardrobe', 'Ceiling Fan', 'Kitchen Slab with Sink'],
        amenities: ['Lift with Backup', '2W Parking', 'CCTV Security'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1502005229762-ee1524218d0c?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          }
        ]
      },
      {
        title: 'Executive 2 BHK in Metoda GIDC Proximity (Industrial Staff & Families)',
        owner: ownerUser._id,
        isVerifiedOwner: true,
        propertyType: 'flat',
        bhk: '2 BHK',
        carpetAreaSqFt: 1020,
        floorNumber: 3,
        totalFloors: 7,
        facing: 'East',
        locality: 'Metoda GIDC',
        societyName: 'Vrundavan Residency',
        fullAddress: 'C-302, Vrundavan Residency, Kalawad Highway, Metoda GIDC Zone, Rajkot',
        landmark: 'Near Metoda Gate No 2',
        distanceToKeyLandmarks: [
          { name: 'Metoda GIDC Gate 2', distanceKm: 0.5 },
          { name: 'Kalawad Road Ring Road Circle', distanceKm: 5.2 }
        ],
        coordinates: { lat: 22.2541, lng: 70.7102 },
        pricing: {
          monthlyRent: 11000,
          securityDeposit: 22000,
          depositMonths: 2,
          maintenanceAmount: 900,
          isMaintenanceIncluded: false,
          brokerageAmount: 0,
          lockInPeriodMonths: 6,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Borewell + Municipal storage',
          waterSource: ['Borewell', 'Municipal RMC/Narmada'],
          drinkingWaterRo: true,
          pipedGasAvailable: false,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Any',
          foodPreference: 'Any',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Semi-Furnished',
        furnishingItems: ['Kitchen Counter & Cabinets', 'Ceiling Fans & Lights', 'Geyser'],
        amenities: ['Covered 4W & 2W Parking', 'Elevator', 'Security Guard', 'Balcony'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Master Bedroom',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Single Private Room for Female Flatmate in 3 BHK on University Road',
        owner: tenantUser._id,
        isVerifiedOwner: false,
        propertyType: 'shared_room',
        bhk: '1 RK',
        carpetAreaSqFt: 350,
        floorNumber: 2,
        totalFloors: 5,
        facing: 'East',
        locality: 'University Road',
        societyName: 'Saraswati Residency',
        fullAddress: 'Flat 202, Saraswati Residency, Near Saurashtra University Main Gate, Rajkot',
        landmark: 'Near University Gate',
        distanceToKeyLandmarks: [
          { name: 'Saurashtra University', distanceKm: 0.3 },
          { name: 'BRTS Stop', distanceKm: 0.4 }
        ],
        coordinates: { lat: 22.3025, lng: 70.7712 },
        pricing: {
          monthlyRent: 5000,
          securityDeposit: 10000,
          depositMonths: 2,
          maintenanceAmount: 400,
          isMaintenanceIncluded: true,
          brokerageAmount: 0,
          lockInPeriodMonths: 3,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'direct_govt_pgvcl',
          subMeterUnitRate: 0,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Continuous',
          waterSource: ['Municipal RMC/Narmada'],
          drinkingWaterRo: true,
          pipedGasAvailable: true,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Bachelors (Female)',
          foodPreference: 'Pure Vegetarian Only',
          gateCurfew: 'Gate Locked at 10:30 PM',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Fully Furnished',
        furnishingItems: ['Single Bed with Mattress', 'Wardrobe', 'Study Table & Chair', 'AC', 'Shared Refrigerator', 'Washing Machine'],
        amenities: ['High Speed WiFi', 'Shared Kitchen Access', 'RO Water Purifier', '2W Parking', 'Lift with Backup'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Bedroom',
            isCoverPhoto: true
          },
          {
            url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Kitchen',
            isCoverPhoto: false
          }
        ]
      },
      {
        title: 'Bed Vacancy in 2-Sharing AC Room on 150 Ft Ring Road (Male Student / Professional)',
        owner: brokerUser._id,
        isVerifiedOwner: false,
        propertyType: 'shared_room',
        bhk: '1 RK',
        carpetAreaSqFt: 300,
        floorNumber: 4,
        totalFloors: 9,
        facing: 'North-East',
        locality: '150 Ft Ring Road',
        societyName: 'Silver Plaza Co-Living',
        fullAddress: 'Room 404, Silver Plaza Co-Living, Near Big Bazaar, 150 Ft Ring Road, Rajkot',
        landmark: 'Near Balaji Hall',
        distanceToKeyLandmarks: [
          { name: 'Balaji Hall BRTS', distanceKm: 0.2 },
          { name: 'Crystal Mall', distanceKm: 2.0 }
        ],
        coordinates: { lat: 22.2845, lng: 70.7798 },
        pricing: {
          monthlyRent: 4200,
          securityDeposit: 8400,
          depositMonths: 2,
          maintenanceAmount: 300,
          isMaintenanceIncluded: true,
          brokerageAmount: 0,
          lockInPeriodMonths: 3,
          noticePeriodDays: 30
        },
        utilities: {
          electricityMeterType: 'sub_meter',
          subMeterUnitRate: 8.5,
          waterSupplyType: '24_7_continuous',
          waterScheduleHours: '24 Hours Municipal Water',
          waterSource: ['Municipal RMC/Narmada', 'Borewell'],
          drinkingWaterRo: true,
          pipedGasAvailable: false,
          fiberInternetPreWired: true
        },
        rules: {
          allowedTenants: 'Bachelors (Male)',
          foodPreference: 'Vegetarian / Jain Preferred',
          gateCurfew: '24/7 Open / Self-Key Access',
          visitorsAllowed: true,
          petsAllowed: false
        },
        furnishingStatus: 'Fully Furnished',
        furnishingItems: ['Twin Bed with Storage', 'Wardrobe', 'Study Desk', 'Split AC', 'Geyser'],
        amenities: ['High Speed WiFi Fiber', 'Daily Housekeeping', 'RO Purifier', 'CCTV Security'],
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Bedroom',
            isCoverPhoto: true
          }
        ]
      }
    ];

    await Property.insertMany(sampleProperties);
    console.log(`🏠 Successfully Seeded ${sampleProperties.length} Authentic Rajkot Properties!`);

    if (require.main === module) {
      process.exit(0);
    }
    return { success: true, count: sampleProperties.length };
  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
