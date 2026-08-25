import { constructMetadata } from "@/lib/seo/metadata";
import BookingForm from "@/components/book/BookingForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = constructMetadata({
  title: "Book a Session",
  description: "Schedule your luxury photography session. Check availability and request a booking directly.",
  path: "/book"
});

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#1C1D20] pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Inquire", href: "/book" }
          ]} 
        />
        
        <div className="mt-8 sm:mt-12 mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight mb-4 sm:mb-8 uppercase text-[#1C1D20]">
            Project <br/><span className="italic text-[#8C7A5B]">Inquiry</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#1C1D20]/60 font-light max-w-2xl leading-relaxed">
            Due to our commitment to uncompromising quality, we accept a limited number of commissions each month. Please share your vision below, and we will be in touch within 24 hours.
          </p>
        </div>
        
        <BookingForm />
      </div>
    </main>
  );
}
