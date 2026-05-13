# 🌿 EthnoDiscovery — Kế Hoạch Phát Triển Full-Stack Chi Tiết

## Tổng Quan Dự Án

EthnoDiscovery là nền tảng du lịch văn hoá cao cấp tập trung vào trải nghiệm bản địa vùng cao Tây Bắc Việt Nam (H'Mông, Dao, Tày). Hệ thống tích hợp AI Journey Planner, VR Preview, đặt phòng homestay và quản lý tour văn hoá.

**Tech Stack chính:**
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** NestJS + TypeScript + PostgreSQL + Redis
- **AI:** Google Gemini API / OpenAI
- **Payment:** VNPay + Stripe International
- **Storage:** Cloudflare R2 / AWS S3
- **Deploy:** Vercel (FE) + Railway/Render (BE)

---

## 🎨 FRONTEND

### Công Nghệ & Cấu Trúc

```
ethno-discovery/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public pages
│   │   ├── page.tsx            # Landing page (từ HTML hiện tại)
│   │   ├── destinations/       # Danh sách & chi tiết điểm đến
│   │   ├── experiences/        # Trải nghiệm văn hoá
│   │   ├── homestays/          # Homestay listing & booking
│   │   ├── tours/              # Tour packages
│   │   └── vr-preview/        # VR/AR experiences
│   ├── (auth)/                 # Auth pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/            # User dashboard
│   │   ├── profile/
│   │   ├── bookings/
│   │   ├── wishlist/
│   │   └── ai-trips/
│   └── (admin)/               # Admin panel
│       ├── overview/
│       ├── tours/
│       ├── homestays/
│       ├── bookings/
│       └── users/
├── components/
│   ├── ui/                    # Design system atoms
│   ├── sections/              # Landing page sections
│   ├── forms/                 # Form components
│   └── layout/                # Navbar, Footer, Sidebar
├── lib/                       # Utilities, API clients
├── hooks/                     # Custom React hooks
├── stores/                    # Zustand state management
└── types/                     # TypeScript definitions
```

---

### Module 1: Landing Page (Đã có HTML → Chuyển sang Next.js)

**Các section cần build thành component:**

| Component | Mô tả | Độ ưu tiên |
|-----------|-------|-----------|
| `<HeroSection>` | Fullscreen hero + search bar + floating orbs | 🔴 Cao |
| `<SmartSearchBar>` | Search với AI gợi ý realtime | 🔴 Cao |
| `<BentoDestinations>` | Grid destinations với hover effects | 🔴 Cao |
| `<CulturalExperiences>` | Horizontal scroll + card grid | 🟡 Trung |
| `<AIJourneyPlanner>` | Form + AI response stream | 🔴 Cao |
| `<HomestayCollection>` | 3-col card grid với booking CTA | 🟡 Trung |
| `<VRPreview>` | Animated VR demo + feature list | 🟢 Thấp |
| `<StatsSection>` | Animated counter numbers | 🟡 Trung |
| `<Reviews>` | Testimonials grid | 🟡 Trung |
| `<Footer>` | Newsletter + links + social | 🟢 Thấp |

---

### Module 2: Destinations & Tours

**Pages cần xây dựng:**

- **`/destinations`** — Grid lọc theo: Tỉnh, Độ khó, Giá, Thời gian, Culture type
- **`/destinations/[slug]`** — Chi tiết điểm đến: Gallery, Map, Weather, Nearby tours, Reviews
- **`/tours`** — Danh sách tour với filters nâng cao
- **`/tours/[id]`** — Tour detail: Itinerary timeline, Inclusions, Host info, Booking form
- **`/experiences/[slug]`** — Chi tiết trải nghiệm văn hoá: Video, How-to, Booking slot picker

**Components quan trọng:**
```typescript
// Itinerary Timeline
<TripTimeline days={itinerary} />

// Date Range Picker cho booking
<DateRangePicker available={availability} />

// Image Gallery với lightbox
<CulturalGallery images={photos} vrEnabled />

// Interactive Map
<DestinationMap markers={locations} />
```

---

### Module 3: AI Journey Planner (Core Feature)

**Flow UI:**

```
User Input Form
    ↓
AI Processing (streaming response)
    ↓
Generated Itinerary Display
    ↓
Save / Modify / Book Actions
```

**Components:**
```typescript
// Conversational AI interface
<AIChat messages={messages} onSend={handleSend} />

// AI-generated trip card
<GeneratedTrip trip={aiResponse} onSave onBook />

// Trip customization panel
<TripEditor itinerary={trip} onUpdate />

// Saved trips collection
<SavedTrips trips={userTrips} />
```

**State Management (Zustand):**
```typescript
interface AITripStore {
  messages: ChatMessage[];
  currentTrip: GeneratedTrip | null;
  savedTrips: Trip[];
  isGenerating: boolean;
  preferences: TripPreferences;
}
```

---

### Module 4: Booking & Payment

**Booking Flow:**
```
Tour/Homestay Detail
    → Select Date & Guests
    → Choose Add-ons (experiences)
    → Review & Confirm
    → Payment (VNPay / Stripe)
    → Confirmation Email
    → User Dashboard
```

**Components:**
```typescript
<BookingWizard steps={4} />
<GuestSelector min={1} max={20} />
<AddOnSelector experiences={culturalActivities} />
<BookingSummary />
<PaymentGateway providers={['vnpay', 'stripe']} />
<BookingConfirmation bookingId={id} />
```

---

### Module 5: User Dashboard

| Tab | Chức năng |
|-----|----------|
| **My Trips** | Lịch sử booking, upcoming trips, trip status |
| **AI Plans** | Saved AI-generated itineraries |
| **Wishlist** | Destinations & homestays saved |
| **Reviews** | Để lại đánh giá sau chuyến đi |
| **Profile** | Thông tin cá nhân, travel preferences |
| **Notifications** | Trip reminders, deals, news |

---

### Module 6: VR/AR Preview

- Tích hợp **A-Frame.js** hoặc **Three.js** cho 360° viewer
- Pannellum.js cho panoramic photo tours
- Mobile: DeviceOrientation API cho gyroscope control
- WebXR API cho VR headset support

---

## ⚙️ BACKEND

### Công Nghệ & Kiến Trúc

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/               # JWT + OAuth2
│   │   ├── users/              # User management
│   │   ├── destinations/       # Destinations CRUD
│   │   ├── tours/              # Tours & packages
│   │   ├── experiences/        # Cultural experiences
│   │   ├── homestays/          # Homestay management
│   │   ├── bookings/           # Booking engine
│   │   ├── payments/           # Payment processing
│   │   ├── ai-planner/        # AI journey generation
│   │   ├── reviews/            # Reviews & ratings
│   │   ├── search/             # Search & filtering
│   │   ├── notifications/      # Email/Push notifications
│   │   ├── media/              # File upload & CDN
│   │   └── admin/              # Admin operations
│   ├── common/
│   │   ├── guards/             # Auth guards
│   │   ├── interceptors/       # Logging, transform
│   │   ├── filters/            # Exception filters
│   │   └── decorators/         # Custom decorators
│   ├── config/                 # App configuration
│   └── database/               # TypeORM entities & migrations
```

---

### Database Schema (PostgreSQL)

```sql
-- Core entities

users
  id, email, password_hash, name, avatar_url,
  phone, nationality, travel_preferences (jsonb),
  role (user/host/admin), created_at

destinations
  id, name_vi, name_en, slug, province,
  description, coordinates (point), images (jsonb),
  altitude, best_season, difficulty_level,
  featured, active, metadata (jsonb)

tours
  id, destination_id, host_id, title, slug,
  description, duration_days, max_group_size,
  price_per_person, includes (jsonb),
  excludes (jsonb), itinerary (jsonb),
  images (jsonb), active, created_at

experiences  (cultural activities)
  id, name, category (weaving/dyeing/cooking/music),
  duration_hours, price, location, description,
  images, available_slots

homestays
  id, host_id, name, destination_id, address,
  description, price_per_night, max_guests,
  amenities (jsonb), images (jsonb),
  latitude, longitude, active

bookings
  id, user_id, bookable_type (tour/homestay),
  bookable_id, check_in, check_out, guests,
  total_price, status (pending/confirmed/cancelled),
  payment_status, add_ons (jsonb), created_at

payments
  id, booking_id, user_id, amount, currency,
  provider (vnpay/stripe), transaction_id,
  status, payment_data (jsonb), created_at

ai_trips (saved AI itineraries)
  id, user_id, title, preferences (jsonb),
  generated_itinerary (jsonb), is_saved,
  created_at

reviews
  id, user_id, reviewable_type, reviewable_id,
  rating (1-5), content, images (jsonb),
  verified_booking, created_at

-- Junction tables
booking_experiences (booking_id, experience_id, quantity)
tour_destinations (tour_id, destination_id, day_number)
```

---

### API Design (RESTful + WebSocket)

#### Auth Module
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/google          # OAuth
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

#### Destinations
```
GET  /api/destinations              # List with filters
GET  /api/destinations/:slug        # Detail
GET  /api/destinations/:slug/tours  # Tours at destination
GET  /api/destinations/featured     # Featured picks
```

#### Tours
```
GET  /api/tours                     # List with filters
GET  /api/tours/:id                 # Detail + itinerary
GET  /api/tours/:id/availability    # Available dates
POST /api/tours                     # Create (host/admin)
PUT  /api/tours/:id                 # Update
```

#### Homestays
```
GET  /api/homestays                 # List with filters
GET  /api/homestays/:id             # Detail
GET  /api/homestays/:id/availability
POST /api/homestays                 # Create (host/admin)
```

#### Bookings
```
POST /api/bookings                  # Create booking
GET  /api/bookings/my               # User's bookings
GET  /api/bookings/:id              # Booking detail
PUT  /api/bookings/:id/cancel       # Cancel booking
```

#### Payments
```
POST /api/payments/vnpay/create     # Create VNPay payment
GET  /api/payments/vnpay/callback   # VNPay callback
POST /api/payments/stripe/intent    # Stripe payment intent
POST /api/payments/stripe/confirm   # Stripe confirm
```

#### AI Planner
```
POST /api/ai/generate-trip          # Generate itinerary (streaming)
POST /api/ai/chat                   # Conversational planning
POST /api/ai/save-trip              # Save generated trip
GET  /api/ai/trips                  # Saved trips
```

#### Search
```
GET  /api/search?q=&type=&province=&price_min=&price_max=&duration=&season=
GET  /api/search/suggestions        # Autocomplete
GET  /api/search/trending           # Trending destinations
```

---

### AI Planner Module — Chi Tiết

**Prompt Engineering Strategy:**
```typescript
const systemPrompt = `
Bạn là chuyên gia du lịch văn hoá vùng cao Tây Bắc Việt Nam của EthnoDiscovery.
Nhiệm vụ: Tạo lịch trình du lịch cá nhân hoá, tập trung vào:
- Trải nghiệm văn hoá H'Mông, Dao, Tày chân thực
- Homestay địa phương
- Ẩm thực bản địa
- Hoạt động ngoài trời phù hợp với vibe và thể lực
- Tối ưu chi phí theo budget

Luôn trả về JSON hợp lệ theo schema đã định.
`;

// Response schema
interface GeneratedTrip {
  title: string;
  summary: string;
  total_days: number;
  estimated_cost: { min: number; max: number; currency: string };
  highlights: string[];
  days: DayPlan[];
  recommended_homestays: HomestayRef[];
  cultural_notes: string;
  packing_list: string[];
}
```

**Streaming Implementation (NestJS + SSE):**
```typescript
@Get('generate-trip')
@Sse()
async generateTrip(@Query() dto: GenerateTripDto): Promise<Observable<MessageEvent>> {
  return this.aiService.streamItinerary(dto);
}
```

---

### Notification System

| Event | Channel |
|-------|---------|
| Booking confirmed | Email + Push |
| Payment success | Email |
| Trip reminder (3 days before) | Email + Push |
| Review request (after trip) | Email |
| New deal/promotion | Push (opt-in) |
| Host message | In-app + Push |

**Stack:** Nodemailer + SendGrid template + Firebase Cloud Messaging

---

### Caching Strategy (Redis)

```
destinations:list          TTL: 1 hour
destinations:{slug}        TTL: 30 min
tours:featured             TTL: 2 hours
search:{hash}              TTL: 15 min
ai:trip:{userId}:{hash}    TTL: 24 hours
availability:{id}:{date}   TTL: 5 min
```

---

## 🗺️ ROADMAP THEO GIAI ĐOẠN

### Phase 1 — MVP (6 tuần)
- [x] Landing page hoàn chỉnh (đã có HTML)
- [ ] Convert sang Next.js 15
- [ ] Auth system (email/password + Google OAuth)
- [ ] Destination & Tour listing
- [ ] Basic booking flow
- [ ] VNPay integration
- [ ] User dashboard cơ bản
- [ ] Admin CRUD cho content

### Phase 2 — AI Core (4 tuần)
- [ ] AI Journey Planner (Gemini API)
- [ ] Conversational chatbot
- [ ] Save & modify AI trips
- [ ] Smart search with AI suggestions
- [ ] Personalized recommendations

### Phase 3 — Experiences & Host (4 tuần)
- [ ] Host portal (đăng ký & quản lý homestay/tour)
- [ ] Cultural experience booking
- [ ] Calendar & availability management
- [ ] Review & rating system
- [ ] Multi-language (VI/EN/JP/KR)

### Phase 4 — VR & Mobile (4 tuần)
- [ ] VR/360° viewer integration
- [ ] Mobile-optimised PWA
- [ ] Offline trip viewing
- [ ] GPS & map integration
- [ ] Push notifications

### Phase 5 — Scale & Analytics (ongoing)
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] A/B testing framework
- [ ] Community features (blog, forum)

---

## ❓ Câu Hỏi Mở / Quyết Định Cần Thảo Luận

> [!IMPORTANT]
> **Bạn muốn bắt đầu từ giai đoạn nào?** Phase 1 (convert sang Next.js) hay tập trung vào một module cụ thể trước?

> [!IMPORTANT]
> **AI Provider:** Dùng Google Gemini (miễn phí tier cao hơn) hay OpenAI GPT-4? Hay cả hai tuỳ tính năng?

> [!WARNING]
> **Host Portal:** Bạn có muốn xây dựng hệ thống cho local host (chủ homestay/tour) tự đăng ký và quản lý không? Điều này ảnh hưởng đến độ phức tạp của backend đáng kể.

> [!NOTE]
> **Monorepo vs Separate Repos:** Recommend dùng **Turborepo monorepo** để quản lý FE + BE + shared types trong cùng một repository.
