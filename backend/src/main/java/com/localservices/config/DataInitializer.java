package com.localservices.config;

import com.localservices.entity.*;
import com.localservices.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProviderRepository providerRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("test@example.com")) {
            User testUser = User.builder()
                    .email("test@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .name("Test User")
                    .role(UserRole.USER)
                    .isActive(true)
                    .build();
            Objects.requireNonNull(userRepository.save(testUser));
            log.info("Default test user created: test@example.com / password123");
        }

        if (userRepository.count() <= 1) {
            log.info("Starting data seeding...");
            seedData();
            log.info("Data seeding completed.");
        } else {
            log.info("Data already exists, skipping seeding.");
        }
    }

    private void seedData() {
        User rahul  = createCustomer("rahul_s",  "Rahul S");
        User priya  = createCustomer("priya_m",  "Priya M");
        User arun   = createCustomer("arun_k",   "Arun K");
        User deepak = createCustomer("deepak_r", "Deepak R");
        User sneha  = createCustomer("sneha_p",  "Sneha P");
        User manish = createCustomer("manish_t", "Manish T");

        // ── PLUMBING (6 providers) ──────────────────────────────────────────────
        Provider p1 = createUserAndProvider("ravi_plumber", "Ravi Plumbing Services",
                ServiceCategory.PLUMBING, 12.9698, 77.7500, 4.7, 25, 450.0,
                "+91 9876543210", "Available",
                "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=400&fit=crop",
                "Ravi Plumbing Services has 8+ years of experience in residential and commercial plumbing. We handle pipe repairs, water leakage, bathroom fittings, and installations with quick response and quality work.",
                "8 Years");
        ServiceItem s1_1 = addService(p1, "Pipe Leakage Repair", "Expert repair of leaking pipes and joints.", 200.0, 45);
        addService(p1, "Bathroom Fittings Installation", "Professional installation of taps, showers, and accessories.", 500.0, 90);
        addService(p1, "Water Tank Repair", "Fixing leaks and cleaning water tanks.", 800.0, 120);
        addService(p1, "Drain Cleaning", "Clearing clogged drains and sewage lines.", 600.0, 60);
        addService(p1, "Kitchen Plumbing Maintenance", "Complete health check for kitchen plumbing.", 400.0, 60);
        addReview(rahul, p1, s1_1, 5, "Very professional. Fixed the water leakage quickly.");
        addReview(priya, p1, s1_1, 5, "Good service and reasonable price. Highly recommended.");
        addReview(arun,  p1, s1_1, 4, "Arrived on time and completed the work perfectly.");

        Provider p1b = createUserAndProvider("kumar_pipes", "Kumar Pipe Works",
                ServiceCategory.PLUMBING, 12.9750, 77.7200, 4.5, 18, 400.0,
                "+91 9876500001", "Available",
                "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=400&fit=crop",
                "Kumar Pipe Works specializes in new pipeline installations and emergency plumbing repairs for apartments and villas.",
                "5 Years");
        ServiceItem s1b_1 = addService(p1b, "Emergency Pipe Repair", "24/7 emergency pipe burst repair.", 350.0, 60);
        addService(p1b, "New Pipeline Installation", "Complete new pipeline setup for homes.", 2500.0, 240);
        addService(p1b, "Tap Replacement", "Replace old or leaking taps.", 250.0, 30);
        addReview(deepak, p1b, s1b_1, 5, "Came within 30 minutes for an emergency. Lifesaver!");
        addReview(sneha,  p1b, s1b_1, 4, "Good work, fair pricing.");

        Provider p1c = createUserAndProvider("sai_plumbing", "Sai Plumbing Solutions",
                ServiceCategory.PLUMBING, 12.9620, 77.7650, 4.3, 10, 380.0,
                "+91 9876500002", "Available",
                "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
                "Sai Plumbing Solutions offers affordable plumbing services for residential complexes with a focus on long-lasting repairs.",
                "3 Years");
        ServiceItem s1c_1 = addService(p1c, "Toilet Repair", "Fix running or blocked toilets.", 300.0, 45);
        addService(p1c, "Water Heater Installation", "Install geysers and water heaters.", 1200.0, 90);
        addReview(manish, p1c, s1c_1, 4, "Neat work and on time.");

        Provider p1d = createUserAndProvider("metro_plumb", "Metro Plumbing Co.",
                ServiceCategory.PLUMBING, 12.9800, 77.7100, 4.6, 32, 500.0,
                "+91 9876500003", "Available",
                "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
                "Metro Plumbing Co. serves commercial and residential clients with certified plumbers and modern equipment.",
                "12 Years");
        ServiceItem s1d_1 = addService(p1d, "Commercial Plumbing", "Full plumbing setup for offices and shops.", 5000.0, 480);
        addService(p1d, "Sewer Line Cleaning", "High-pressure sewer line cleaning.", 1500.0, 120);
        addReview(rahul, p1d, s1d_1, 5, "Professional team, excellent finish.");
        addReview(priya, p1d, s1d_1, 5, "Very thorough and clean work.");

        Provider p1e = createUserAndProvider("quick_plumb", "QuickFix Plumbers",
                ServiceCategory.PLUMBING, 12.9550, 77.7400, 4.4, 14, 420.0,
                "+91 9876500004", "Busy",
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop",
                "QuickFix Plumbers guarantees same-day service for all minor and major plumbing issues.",
                "4 Years");
        ServiceItem s1e_1 = addService(p1e, "Same-Day Repair", "Guaranteed same-day plumbing fix.", 450.0, 60);
        addReview(arun, p1e, s1e_1, 4, "Fast and efficient service.");

        Provider p1f = createUserAndProvider("green_plumb", "GreenFlow Plumbing",
                ServiceCategory.PLUMBING, 12.9900, 77.7300, 4.8, 40, 550.0,
                "+91 9876500005", "Available",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
                "GreenFlow Plumbing uses eco-friendly materials and water-saving fixtures to reduce your water bill.",
                "7 Years");
        ServiceItem s1f_1 = addService(p1f, "Water-Saving Fixture Install", "Install low-flow taps and showers.", 800.0, 90);
        addService(p1f, "Rainwater Harvesting Setup", "Complete rainwater collection system.", 8000.0, 480);
        addReview(deepak, p1f, s1f_1, 5, "Reduced our water bill by 30%. Amazing!");
        addReview(sneha,  p1f, s1f_1, 5, "Very knowledgeable and eco-conscious team.");

        // ── ELECTRICAL (6 providers) ────────────────────────────────────────────
        Provider p2 = createUserAndProvider("shiva_electric", "Shiva Electric Works",
                ServiceCategory.ELECTRICAL, 12.9591, 77.6974, 4.6, 12, 500.0,
                "+91 9876501234", "Available",
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
                "Shiva Electrical Works specializes in electrical installation and repair. Skilled technicians handle wiring, lighting, circuit repairs, and maintenance for homes and offices.",
                "6 Years");
        ServiceItem s2_1 = addService(p2, "House Wiring Installation", "Complete electrical wiring for new homes.", 3500.0, 480);
        addService(p2, "Switchboard Repair", "Fixing faulty switches and connections.", 300.0, 30);
        addService(p2, "Lighting Setup", "Installation of fans, decorative lights, and LED panels.", 600.0, 90);
        addService(p2, "Fault Troubleshooting", "Detection and repair of electrical short circuits.", 700.0, 120);
        addService(p2, "Inverter Setup", "Installation and setup of power backup systems.", 1200.0, 180);
        addReview(deepak, p2, s2_1, 5, "Excellent work. Solved our wiring issue safely.");
        addReview(sneha,  p2, s2_1, 5, "Quick response and professional service.");
        addReview(manish, p2, s2_1, 5, "Very knowledgeable technician.");

        Provider p2b = createUserAndProvider("volt_tech", "VoltTech Electricians",
                ServiceCategory.ELECTRICAL, 12.9650, 77.6800, 4.7, 28, 550.0,
                "+91 9876501001", "Available",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
                "VoltTech provides certified electrical services including solar panel installation and smart home wiring.",
                "9 Years");
        ServiceItem s2b_1 = addService(p2b, "Solar Panel Installation", "Rooftop solar setup with net metering.", 45000.0, 480);
        addService(p2b, "Smart Home Wiring", "Automate lights, fans, and appliances.", 8000.0, 360);
        addService(p2b, "MCB Panel Upgrade", "Replace old fuse boxes with modern MCB panels.", 2500.0, 120);
        addReview(rahul, p2b, s2b_1, 5, "Solar installation was flawless. Great ROI!");
        addReview(priya, p2b, s2b_1, 5, "Smart home setup is amazing. Very professional.");

        Provider p2c = createUserAndProvider("power_fix", "PowerFix Electrical",
                ServiceCategory.ELECTRICAL, 12.9500, 77.7100, 4.4, 9, 480.0,
                "+91 9876501002", "Available",
                "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
                "PowerFix handles all residential electrical repairs with same-day service guarantee.",
                "4 Years");
        ServiceItem s2c_1 = addService(p2c, "Fan Installation", "Ceiling fan fitting and wiring.", 350.0, 45);
        addService(p2c, "AC Wiring", "Dedicated AC power line installation.", 800.0, 90);
        addReview(arun, p2c, s2c_1, 4, "Quick and clean installation.");

        Provider p2d = createUserAndProvider("bright_spark", "BrightSpark Electricals",
                ServiceCategory.ELECTRICAL, 12.9720, 77.6600, 4.5, 21, 520.0,
                "+91 9876501003", "Available",
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop",
                "BrightSpark specializes in commercial electrical projects and industrial wiring.",
                "11 Years");
        ServiceItem s2d_1 = addService(p2d, "Commercial Wiring", "Full electrical setup for shops and offices.", 12000.0, 720);
        addService(p2d, "Generator Installation", "Backup generator wiring and setup.", 5000.0, 240);
        addReview(deepak, p2d, s2d_1, 5, "Handled our entire office wiring perfectly.");
        addReview(manish, p2d, s2d_1, 4, "Reliable and on schedule.");

        Provider p2e = createUserAndProvider("safe_wire", "SafeWire Electricians",
                ServiceCategory.ELECTRICAL, 12.9450, 77.6900, 4.3, 7, 460.0,
                "+91 9876501004", "Busy",
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=400&fit=crop",
                "SafeWire focuses on electrical safety audits and fire hazard prevention for homes.",
                "5 Years");
        ServiceItem s2e_1 = addService(p2e, "Electrical Safety Audit", "Full home electrical safety inspection.", 1500.0, 120);
        addReview(sneha, p2e, s2e_1, 4, "Found several hidden hazards. Very thorough.");

        Provider p2f = createUserAndProvider("current_pro", "CurrentPro Services",
                ServiceCategory.ELECTRICAL, 12.9850, 77.6700, 4.6, 35, 510.0,
                "+91 9876501005", "Available",
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop",
                "CurrentPro offers 24/7 emergency electrical services and routine maintenance contracts.",
                "8 Years");
        ServiceItem s2f_1 = addService(p2f, "24/7 Emergency Repair", "Round-the-clock electrical emergency service.", 800.0, 60);
        addService(p2f, "Annual Maintenance Contract", "Yearly electrical maintenance package.", 3000.0, 120);
        addReview(rahul, p2f, s2f_1, 5, "Came at midnight for an emergency. Excellent!");
        addReview(arun,  p2f, s2f_1, 5, "Best emergency service in the area.");

        // ── CLEANING (6 providers) ──────────────────────────────────────────────
        Provider p3 = createUserAndProvider("home_shine", "Home Shine Cleaning",
                ServiceCategory.CLEANING, 13.0100, 77.5700, 4.9, 120, 350.0,
                "+91 9876556789", "Busy",
                "https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=400&h=400&fit=crop",
                "Professional cleaning services for a sparkling home. We use eco-friendly products and industrial equipment for deep cleaning.",
                "5 Years");
        ServiceItem s3_1 = addService(p3, "Full House Deep Cleaning", "All-round sanitation and dusting.", 4000.0, 360);
        addService(p3, "Kitchen Deep Clean", "Degreasing and sanitizing kitchen surfaces.", 1500.0, 120);
        addService(p3, "Bathroom Sanitization", "Complete bathroom disinfection.", 800.0, 60);
        addReview(priya,  p3, s3_1, 5, "House looks brand new! Excellent service.");
        addReview(sneha,  p3, s3_1, 5, "Very thorough and professional team.");
        addReview(manish, p3, s3_1, 5, "Best cleaning service I've used.");

        Provider p3b = createUserAndProvider("sparkle_clean", "Sparkle Clean Pro",
                ServiceCategory.CLEANING, 13.0050, 77.5900, 4.7, 85, 320.0,
                "+91 9876502001", "Available",
                "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop",
                "Sparkle Clean Pro offers affordable home and office cleaning with trained staff and quality supplies.",
                "4 Years");
        ServiceItem s3b_1 = addService(p3b, "Office Cleaning", "Daily or weekly office cleaning service.", 2000.0, 180);
        addService(p3b, "Sofa & Carpet Cleaning", "Steam cleaning for sofas and carpets.", 1200.0, 120);
        addService(p3b, "Post-Construction Cleaning", "Remove dust and debris after renovation.", 5000.0, 480);
        addReview(rahul,  p3b, s3b_1, 5, "Office is spotless every morning. Great team!");
        addReview(deepak, p3b, s3b_1, 4, "Reliable and punctual service.");

        Provider p3c = createUserAndProvider("fresh_home", "FreshHome Services",
                ServiceCategory.CLEANING, 13.0200, 77.5500, 4.5, 60, 300.0,
                "+91 9876502002", "Available",
                "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
                "FreshHome provides regular home cleaning subscriptions with background-verified staff.",
                "3 Years");
        ServiceItem s3c_1 = addService(p3c, "Weekly Home Cleaning", "Regular weekly cleaning subscription.", 1200.0, 120);
        addService(p3c, "Move-In/Move-Out Cleaning", "Thorough cleaning for new or vacated homes.", 3500.0, 300);
        addReview(arun,  p3c, s3c_1, 5, "Consistent quality every week.");
        addReview(priya, p3c, s3c_1, 4, "Good value for money.");

        Provider p3d = createUserAndProvider("eco_clean", "EcoClean Solutions",
                ServiceCategory.CLEANING, 12.9950, 77.5800, 4.8, 95, 380.0,
                "+91 9876502003", "Available",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
                "EcoClean uses only certified organic and biodegradable cleaning products, safe for kids and pets.",
                "6 Years");
        ServiceItem s3d_1 = addService(p3d, "Eco-Friendly Deep Clean", "Chemical-free deep cleaning for homes.", 4500.0, 360);
        addService(p3d, "Baby Room Sanitization", "Safe sanitization for nurseries and baby rooms.", 1000.0, 90);
        addReview(sneha,  p3d, s3d_1, 5, "Safe for my toddler. Absolutely love this service!");
        addReview(manish, p3d, s3d_1, 5, "Eco-friendly and effective. Highly recommend.");

        Provider p3e = createUserAndProvider("pest_clean", "CleanShield Pest & Clean",
                ServiceCategory.CLEANING, 13.0150, 77.6000, 4.4, 42, 400.0,
                "+91 9876502004", "Available",
                "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop",
                "CleanShield combines pest control and deep cleaning for a completely hygienic home environment.",
                "7 Years");
        ServiceItem s3e_1 = addService(p3e, "Pest Control + Cleaning Combo", "Pest treatment followed by full home cleaning.", 3000.0, 300);
        addReview(rahul, p3e, s3e_1, 4, "Got rid of cockroaches and the house is clean now.");

        Provider p3f = createUserAndProvider("window_shine", "WindowShine Cleaners",
                ServiceCategory.CLEANING, 13.0000, 77.5600, 4.6, 55, 330.0,
                "+91 9876502005", "Available",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
                "WindowShine specializes in glass, window, and facade cleaning for apartments and commercial buildings.",
                "5 Years");
        ServiceItem s3f_1 = addService(p3f, "Window & Glass Cleaning", "Streak-free cleaning for all windows.", 800.0, 90);
        addService(p3f, "Building Facade Cleaning", "High-rise exterior cleaning with safety equipment.", 15000.0, 480);
        addReview(deepak, p3f, s3f_1, 5, "Windows are crystal clear. Great job!");
        addReview(arun,   p3f, s3f_1, 5, "Professional and safe high-rise cleaning.");

        // ── CARPENTRY (5 providers) ─────────────────────────────────────────────
        Provider p4 = createUserAndProvider("wood_craft", "WoodCraft Carpentry",
                ServiceCategory.CARPENTRY, 12.9400, 77.6200, 4.7, 38, 480.0,
                "+91 9876503001", "Available",
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
                "WoodCraft Carpentry creates custom furniture and handles all woodwork repairs with premium quality materials.",
                "10 Years");
        ServiceItem s4_1 = addService(p4, "Custom Furniture Making", "Bespoke wardrobes, tables, and shelves.", 8000.0, 720);
        addService(p4, "Door & Window Repair", "Fix squeaky or damaged doors and windows.", 500.0, 60);
        addService(p4, "Modular Kitchen Fitting", "Install modular kitchen cabinets.", 15000.0, 480);
        addReview(priya,  p4, s4_1, 5, "Beautiful wardrobe. Exactly what I wanted!");
        addReview(sneha,  p4, s4_1, 5, "Excellent craftsmanship and on-time delivery.");
        addReview(manish, p4, s4_1, 5, "Best carpenter in the area.");

        Provider p4b = createUserAndProvider("fix_wood", "FixWood Repairs",
                ServiceCategory.CARPENTRY, 12.9350, 77.6400, 4.5, 22, 420.0,
                "+91 9876503002", "Available",
                "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
                "FixWood specializes in quick furniture repairs and polishing services at affordable rates.",
                "6 Years");
        ServiceItem s4b_1 = addService(p4b, "Furniture Polishing", "Restore shine to old wooden furniture.", 1200.0, 120);
        addService(p4b, "Chair & Table Repair", "Fix broken legs, joints, and surfaces.", 400.0, 60);
        addReview(rahul,  p4b, s4b_1, 5, "My old dining table looks brand new!");
        addReview(deepak, p4b, s4b_1, 4, "Good work at a fair price.");

        Provider p4c = createUserAndProvider("interior_wood", "Interior Wood Studio",
                ServiceCategory.CARPENTRY, 12.9480, 77.6100, 4.8, 50, 600.0,
                "+91 9876503003", "Busy",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
                "Interior Wood Studio designs and installs premium interior woodwork including false ceilings and wall panels.",
                "14 Years");
        ServiceItem s4c_1 = addService(p4c, "False Ceiling Installation", "Wooden and PVC false ceiling design.", 12000.0, 480);
        addService(p4c, "Wall Paneling", "Decorative wooden wall panels.", 8000.0, 360);
        addReview(arun,  p4c, s4c_1, 5, "Transformed our living room completely!");
        addReview(priya, p4c, s4c_1, 5, "Stunning craftsmanship. Worth every rupee.");

        Provider p4d = createUserAndProvider("quick_carp", "QuickCarp Services",
                ServiceCategory.CARPENTRY, 12.9300, 77.6300, 4.3, 15, 400.0,
                "+91 9876503004", "Available",
                "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=400&fit=crop",
                "QuickCarp offers same-day minor carpentry repairs for homes and offices.",
                "3 Years");
        ServiceItem s4d_1 = addService(p4d, "Lock & Hinge Repair", "Fix door locks, hinges, and handles.", 300.0, 30);
        addReview(sneha, p4d, s4d_1, 4, "Fast and affordable fix.");

        Provider p4e = createUserAndProvider("bamboo_craft", "BambooCraft Interiors",
                ServiceCategory.CARPENTRY, 12.9550, 77.6050, 4.6, 30, 520.0,
                "+91 9876503005", "Available",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
                "BambooCraft uses sustainable bamboo and reclaimed wood for eco-friendly furniture and interiors.",
                "8 Years");
        ServiceItem s4e_1 = addService(p4e, "Bamboo Furniture Making", "Custom eco-friendly bamboo furniture.", 6000.0, 480);
        addService(p4e, "Reclaimed Wood Shelving", "Rustic shelves from reclaimed wood.", 3000.0, 180);
        addReview(manish, p4e, s4e_1, 5, "Unique and sustainable. Love the bamboo table!");
        addReview(rahul,  p4e, s4e_1, 5, "Great quality and eco-conscious approach.");

        // ── PAINTING (5 providers) ──────────────────────────────────────────────
        Provider p5 = createUserAndProvider("color_master", "ColorMaster Painters",
                ServiceCategory.PAINTING, 12.9800, 77.5400, 4.6, 44, 350.0,
                "+91 9876504001", "Available",
                "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop",
                "ColorMaster Painters delivers premium interior and exterior painting with top-quality paints and skilled painters.",
                "9 Years");
        ServiceItem s5_1 = addService(p5, "Interior Wall Painting", "Full interior painting with primer and 2 coats.", 6000.0, 480);
        addService(p5, "Exterior Painting", "Weather-resistant exterior paint application.", 12000.0, 720);
        addService(p5, "Texture Painting", "Decorative texture finishes for walls.", 4000.0, 360);
        addReview(priya,  p5, s5_1, 5, "Beautiful finish. House looks amazing!");
        addReview(deepak, p5, s5_1, 5, "Professional team, clean work.");
        addReview(arun,   p5, s5_1, 4, "Good quality paint and neat application.");

        Provider p5b = createUserAndProvider("wall_art", "WallArt Decorators",
                ServiceCategory.PAINTING, 12.9750, 77.5200, 4.8, 62, 400.0,
                "+91 9876504002", "Available",
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop",
                "WallArt Decorators specializes in artistic wall murals, stencil art, and 3D wall designs.",
                "7 Years");
        ServiceItem s5b_1 = addService(p5b, "Wall Mural Painting", "Custom artistic murals for any room.", 8000.0, 480);
        addService(p5b, "3D Wall Design", "Stunning 3D effect wall painting.", 5000.0, 360);
        addReview(sneha,  p5b, s5b_1, 5, "The mural in our living room is breathtaking!");
        addReview(manish, p5b, s5b_1, 5, "Incredibly talented artists.");

        Provider p5c = createUserAndProvider("budget_paint", "BudgetPaint Services",
                ServiceCategory.PAINTING, 12.9850, 77.5600, 4.3, 28, 280.0,
                "+91 9876504003", "Available",
                "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
                "BudgetPaint offers quality painting at the most affordable rates without compromising on finish.",
                "4 Years");
        ServiceItem s5c_1 = addService(p5c, "Single Room Painting", "Quick single room paint job.", 1500.0, 180);
        addReview(rahul, p5c, s5c_1, 4, "Good quality for the price.");

        Provider p5d = createUserAndProvider("pro_coat", "ProCoat Painting",
                ServiceCategory.PAINTING, 12.9700, 77.5100, 4.5, 35, 370.0,
                "+91 9876504004", "Busy",
                "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=400&fit=crop",
                "ProCoat uses premium Asian Paints and Berger products with a 2-year warranty on all work.",
                "6 Years");
        ServiceItem s5d_1 = addService(p5d, "Premium Paint with Warranty", "2-year warranty painting service.", 8000.0, 480);
        addReview(deepak, p5d, s5d_1, 5, "Warranty gives great peace of mind. Excellent work.");
        addReview(priya,  p5d, s5d_1, 4, "Premium quality, worth the price.");

        Provider p5e = createUserAndProvider("wood_paint", "WoodFinish Painters",
                ServiceCategory.PAINTING, 12.9650, 77.5300, 4.7, 48, 420.0,
                "+91 9876504005", "Available",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
                "WoodFinish specializes in wood staining, varnishing, and furniture painting for a premium look.",
                "11 Years");
        ServiceItem s5e_1 = addService(p5e, "Wood Staining & Varnishing", "Protect and beautify wooden surfaces.", 2500.0, 240);
        addService(p5e, "Furniture Repainting", "Repaint old furniture in new colors.", 1800.0, 180);
        addReview(arun,   p5e, s5e_1, 5, "My wooden doors look brand new!");
        addReview(sneha,  p5e, s5e_1, 5, "Excellent wood finishing work.");

        // ── AUTOMOTIVE (5 providers) ────────────────────────────────────────────
        Provider p6 = createUserAndProvider("precision_mechanic", "Precision Mechanics",
                ServiceCategory.AUTOMOTIVE, 12.9100, 77.6400, 4.8, 56, 600.0,
                "+91 9876545678", "Available",
                "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
                "Precision Mechanics offers expert bike and car maintenance with computerized diagnostics and high-performance servicing.",
                "10 Years");
        ServiceItem s6_1 = addService(p6, "Bike Repair & Maintenance", "Full servicing including oil change and brakes.", 600.0, 120);
        addService(p6, "Engine Diagnostics", "Computerized engine health check.", 1000.0, 60);
        addService(p6, "Brake Repair", "Brake pad replacement and efficiency check.", 400.0, 45);
        addService(p6, "Oil Change & Servicing", "Premium oil replacement.", 800.0, 45);
        addService(p6, "Battery Replacement", "New battery installation with warranty.", 2500.0, 30);
        addReview(rahul,  p6, s6_1, 5, "They know bikes inside out. My vehicle feels new!");
        addReview(deepak, p6, s6_1, 5, "Best mechanic in Bangalore.");

        Provider p6b = createUserAndProvider("car_care", "CarCare Auto Services",
                ServiceCategory.AUTOMOTIVE, 12.9050, 77.6600, 4.6, 40, 650.0,
                "+91 9876505001", "Available",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
                "CarCare provides comprehensive car servicing, denting, painting, and AC repair for all car brands.",
                "8 Years");
        ServiceItem s6b_1 = addService(p6b, "Full Car Service", "Complete car servicing package.", 3000.0, 360);
        addService(p6b, "Car AC Repair", "AC gas refill and compressor repair.", 1500.0, 120);
        addService(p6b, "Denting & Painting", "Remove dents and repaint affected areas.", 5000.0, 480);
        addReview(priya, p6b, s6b_1, 5, "Car runs like new after the full service.");
        addReview(arun,  p6b, s6b_1, 4, "Good service, reasonable pricing.");

        Provider p6c = createUserAndProvider("tyre_king", "TyreKing Auto",
                ServiceCategory.AUTOMOTIVE, 12.9200, 77.6200, 4.5, 33, 500.0,
                "+91 9876505002", "Available",
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop",
                "TyreKing specializes in tyre replacement, wheel alignment, and balancing for all vehicles.",
                "6 Years");
        ServiceItem s6c_1 = addService(p6c, "Tyre Replacement", "New tyre fitting for cars and bikes.", 2000.0, 60);
        addService(p6c, "Wheel Alignment & Balancing", "Precision wheel alignment service.", 800.0, 45);
        addReview(sneha,  p6c, s6c_1, 5, "Quick tyre change and great prices.");
        addReview(manish, p6c, s6c_1, 4, "Professional and fast service.");

        Provider p6d = createUserAndProvider("doorstep_auto", "Doorstep Auto Repair",
                ServiceCategory.AUTOMOTIVE, 12.9150, 77.6500, 4.7, 25, 700.0,
                "+91 9876505003", "Available",
                "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
                "Doorstep Auto Repair comes to your location for minor repairs, battery jump-starts, and tyre changes.",
                "5 Years");
        ServiceItem s6d_1 = addService(p6d, "Doorstep Battery Jump-Start", "On-location battery assistance.", 300.0, 30);
        addService(p6d, "Roadside Tyre Change", "Emergency tyre change at your location.", 500.0, 45);
        addReview(rahul, p6d, s6d_1, 5, "Saved me when I was stranded. Super fast!");

        Provider p6e = createUserAndProvider("ev_service", "EV Care Services",
                ServiceCategory.AUTOMOTIVE, 12.9250, 77.6350, 4.8, 18, 750.0,
                "+91 9876505004", "Available",
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop",
                "EV Care Services specializes in electric vehicle maintenance, battery health checks, and software updates.",
                "3 Years");
        ServiceItem s6e_1 = addService(p6e, "EV Battery Health Check", "Comprehensive EV battery diagnostics.", 1200.0, 90);
        addService(p6e, "EV Software Update", "Latest firmware and software updates for EVs.", 500.0, 60);
        addReview(deepak, p6e, s6e_1, 5, "Finally a mechanic who understands EVs!");
        addReview(priya,  p6e, s6e_1, 5, "Excellent EV expertise. Highly recommended.");

        // ── HEALTHCARE (5 providers) ────────────────────────────────────────────
        Provider p7 = createUserAndProvider("lakshmi_med", "Lakshmi Medical Store",
                ServiceCategory.HEALTHCARE, 12.9961, 77.6960, 4.6, 45, 0.0,
                "+91 9876512345", "Open",
                "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=400&fit=crop",
                "Reliable healthcare shop providing prescription medicines, health gadgets, and emergency supplies with home delivery.",
                "15 Years");
        ServiceItem s7_1 = addService(p7, "Prescription Medicine Delivery", "Regular monthly health supplies.", 2000.0, 30);
        addService(p7, "Home Delivery", "Medicine delivery within 1 hour.", 40.0, 60);
        addReview(arun,   p7, s7_1, 5, "Always have the medicines I need. Fast delivery!");
        addReview(sneha,  p7, s7_1, 5, "Reliable and trustworthy medical store.");

        Provider p7b = createUserAndProvider("home_nurse", "HomeNurse Care",
                ServiceCategory.HEALTHCARE, 12.9900, 77.7000, 4.8, 30, 800.0,
                "+91 9876506001", "Available",
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
                "HomeNurse Care provides certified nursing services at home including injections, wound care, and post-surgery care.",
                "8 Years");
        ServiceItem s7b_1 = addService(p7b, "Home Nursing Visit", "Certified nurse visit for daily care.", 600.0, 60);
        addService(p7b, "Post-Surgery Care", "Specialized care after surgical procedures.", 1500.0, 120);
        addService(p7b, "Injection & IV Drip", "Administer injections and IV fluids at home.", 400.0, 30);
        addReview(manish, p7b, s7b_1, 5, "Excellent care for my elderly mother.");
        addReview(rahul,  p7b, s7b_1, 5, "Professional and compassionate nurses.");

        Provider p7c = createUserAndProvider("lab_home", "LabHome Diagnostics",
                ServiceCategory.HEALTHCARE, 12.9850, 77.6800, 4.7, 55, 0.0,
                "+91 9876506002", "Available",
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
                "LabHome Diagnostics collects blood and urine samples at your home and delivers reports within 24 hours.",
                "5 Years");
        ServiceItem s7c_1 = addService(p7c, "Home Blood Test", "Sample collection at home, report in 24hrs.", 300.0, 30);
        addService(p7c, "Full Body Checkup", "Comprehensive health screening package.", 1500.0, 60);
        addReview(priya,  p7c, s7c_1, 5, "So convenient! No need to visit the lab.");
        addReview(deepak, p7c, s7c_1, 4, "Accurate reports delivered on time.");

        Provider p7d = createUserAndProvider("physio_home", "PhysioHome Therapy",
                ServiceCategory.HEALTHCARE, 12.9950, 77.6900, 4.9, 22, 900.0,
                "+91 9876506003", "Available",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
                "PhysioHome provides certified physiotherapy sessions at home for injury recovery and chronic pain management.",
                "6 Years");
        ServiceItem s7d_1 = addService(p7d, "Physiotherapy Session", "60-minute physiotherapy at home.", 800.0, 60);
        addService(p7d, "Post-Fracture Rehab", "Rehabilitation program after fractures.", 1200.0, 90);
        addReview(arun,   p7d, s7d_1, 5, "Recovered from knee injury thanks to these sessions!");
        addReview(sneha,  p7d, s7d_1, 5, "Excellent physiotherapist. Very knowledgeable.");

        Provider p7e = createUserAndProvider("dental_home", "SmileCare Dental",
                ServiceCategory.HEALTHCARE, 12.9920, 77.7050, 4.5, 38, 1000.0,
                "+91 9876506004", "Available",
                "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=400&fit=crop",
                "SmileCare Dental offers home dental consultations and basic dental procedures for patients who cannot visit a clinic.",
                "4 Years");
        ServiceItem s7e_1 = addService(p7e, "Home Dental Consultation", "Dentist visit at your home.", 500.0, 45);
        addService(p7e, "Teeth Cleaning", "Professional scaling and polishing.", 800.0, 60);
        addReview(manish, p7e, s7e_1, 5, "Great for elderly parents who can't travel.");
        addReview(rahul,  p7e, s7e_1, 4, "Convenient and professional service.");

        // ── SHOPPING (3 providers) ──────────────────────────────────────────────
        Provider p8 = createUserAndProvider("krishna_grocery", "Sri Krishna Groceries",
                ServiceCategory.SHOPPING, 12.9716, 77.5946, 4.8, 89, 0.0,
                "+91 9876523456", "Open",
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
                "Premium grocery store specializing in organic farm-fresh produce and artisanal local goods.",
                "20 Years");
        ServiceItem s8_1 = addService(p8, "Organic Veggie Box", "Seasonal fresh vegetables.", 500.0, 60);
        addService(p8, "Grocery Home Delivery", "Same-day grocery delivery.", 50.0, 60);
        addReview(priya,  p8, s8_1, 5, "Freshest vegetables in the area!");
        addReview(deepak, p8, s8_1, 5, "Love the organic produce. Very fresh.");

        Provider p8b = createUserAndProvider("daily_mart", "DailyMart Express",
                ServiceCategory.SHOPPING, 12.9680, 77.5800, 4.6, 65, 0.0,
                "+91 9876507001", "Open",
                "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=400&fit=crop",
                "DailyMart Express delivers daily essentials, snacks, and beverages within 30 minutes.",
                "3 Years");
        ServiceItem s8b_1 = addService(p8b, "30-Min Express Delivery", "Essentials delivered in 30 minutes.", 30.0, 30);
        addReview(arun,   p8b, s8b_1, 5, "Incredibly fast delivery. Love this service!");
        addReview(sneha,  p8b, s8b_1, 4, "Good selection and quick delivery.");

        Provider p8c = createUserAndProvider("pet_store", "PetCare Supplies",
                ServiceCategory.SHOPPING, 12.9740, 77.6000, 4.7, 42, 0.0,
                "+91 9876507002", "Open",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
                "PetCare Supplies offers premium pet food, accessories, and grooming products with home delivery.",
                "5 Years");
        ServiceItem s8c_1 = addService(p8c, "Pet Food Delivery", "Premium pet food delivered to your door.", 800.0, 60);
        addReview(manish, p8c, s8c_1, 5, "My dog loves the food from here!");
        addReview(rahul,  p8c, s8c_1, 5, "Great variety of pet products.");
    }

    private User createCustomer(String username, String name) {
        User user = User.builder()
                .email(username + "@example.com")
                .password(passwordEncoder.encode("password123"))
                .name(name)
                .role(UserRole.USER)
                .isActive(true)
                .build();
        return Objects.requireNonNull(userRepository.save(user));
    }

    private Provider createUserAndProvider(
            String username, String businessName, ServiceCategory category,
            Double lat, Double lng, Double rating, Integer reviews, Double hourlyRate,
            String phone, String availability, String profileImage, String description, String experience) {

        User user = User.builder()
                .email(username + "@example.com")
                .password(passwordEncoder.encode("password123"))
                .name(businessName)
                .role(UserRole.PROVIDER)
                .isActive(true)
                .build();
        user = Objects.requireNonNull(userRepository.save(user));

        Provider provider = Provider.builder()
                .user(user)
                .businessName(businessName)
                .description(description)
                .serviceCategory(category)
                .hourlyRate(hourlyRate)
                .rating(rating)
                .totalReviews(reviews)
                .isVerified(true)
                .latitude(lat)
                .longitude(lng)
                .phone(phone)
                .availability(availability)
                .profileImage(profileImage)
                .experience(experience)
                .address("Bangalore, Karnataka")
                .workingHours("9:00 AM - 6:00 PM")
                .build();
        return Objects.requireNonNull(providerRepository.save(provider));
    }

    private ServiceItem addService(Provider provider, String name, String description, Double price, Integer duration) {
        ServiceItem service = ServiceItem.builder()
                .provider(provider)
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .durationMinutes(duration)
                .category(provider.getServiceCategory())
                .isActive(true)
                .build();
        return Objects.requireNonNull(serviceRepository.save(service));
    }

    private void addReview(User user, Provider provider, ServiceItem service, Integer rating, String comment) {
        Booking booking = Booking.builder()
                .user(user)
                .provider(provider)
                .service(service)
                .scheduledDate(LocalDate.now().minusDays(1))
                .scheduledTime(LocalTime.NOON)
                .bookingStatus(BookingStatus.COMPLETED)
                .paymentStatus(PaymentStatus.PAID)
                .totalAmount(service.getPrice())
                .address("Customer's Address")
                .build();
        booking = Objects.requireNonNull(bookingRepository.save(booking));

        Review review = Review.builder()
                .booking(booking)
                .user(user)
                .provider(provider)
                .rating(rating)
                .comment(comment)
                .build();
        Objects.requireNonNull(reviewRepository.save(review));
    }
}
