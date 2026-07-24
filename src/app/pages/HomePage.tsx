import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import HomeSections from "../components/HomeSections";
import type { PublicOutletCtx } from "../layouts/PublicLayout";
import type { Page } from "../data";

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function HomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSetCurrentPage = (page: Page) => {
    if (page) {
      navigate(`/category/${toSlug(page.category)}/${toSlug(page.sub)}`);
    }
  };

  return (
    <HomeSections
      setCurrentPage={handleSetCurrentPage}
      email={email}
      setEmail={setEmail}
      subscribed={subscribed}
      setSubscribed={setSubscribed}
    />
  );
}
