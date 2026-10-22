import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Icon } from '../ui/Icon';
import { CountUp } from '../ui/CountUp';
import { GrowthChart } from '../ui/GrowthChart';

/** About teaser with the crane video (plays only while visible) and two stats. */
export function AboutSection() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const play = () => v.play().catch(() => {});
    if (!('IntersectionObserver' in window)) {
      play();
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? play() : v.pause())), {
      threshold: 0.2,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="stack">
      <div className="wrap about">
        <div className="about-img reveal">
          <video
            ref={video}
            className="scene-photo"
            id="aboutVideo"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/img/sections/about-poster.jpg"
            aria-label="MAS Express Cargo container being lifted by a crane at the port"
          >
            <source src="/video/about-crane.mp4" type="video/mp4" />
          </video>
          <div className="stats">
            <div className="stat a">
              <b>
                <CountUp value="850" duration={1700} />
                <sup>+</sup>
              </b>
              <span>Daily Shipment</span>
              <GrowthChart />
            </div>
            <div className="stat b">
              <b>
                <CountUp value="99.8" duration={1700} />
                <sup>%</sup>
              </b>
              <span>On-Time Delivery</span>
              <GrowthChart />
            </div>
          </div>
        </div>
        <div className="reveal">
          <span className="eyebrow">About Us</span>
          <h2 className="big">
            Your Premier Partner for <em>GCC &amp; Global Logistics!</em>
          </h2>
          <div className="feat">
            <div>
              <span className="ic">
                <Icon name="radar" />
              </span>
              <span>
                <h3>MAS Express Cargo Tracking System</h3>
                <p>Real-time GPS tracking with status updates on our customer portal.</p>
              </span>
            </div>
            <div>
              <span className="ic">
                <Icon name="globe" />
              </span>
              <span>
                <h3>GCC Network Experts</h3>
                <p>Unmatched knowledge of GCC customs, regulations, and trade routes.</p>
              </span>
            </div>
          </div>
          <p className="body">
            MAS Express Cargo specializes in secure, reliable, and timely transportation across the GCC and worldwide.
            With cutting-edge MAS Express Cargo Tracking System, dedicated account management, and deep regional
            expertise, we deliver peace of mind from pickup to final delivery.
          </p>
          <div className="btn-row" style={{ alignItems: 'center', gap: 24 }}>
            <Link className="btn brand" to="/about">
              More About Us <Icon name="arrow" />
            </Link>
            <div className="callus">
              <span className="ph">
                <Icon name="phone" />
              </span>
              <span>
                <small>Call Us</small>
                <a href="tel:+9718004786">+971 800 4786</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
