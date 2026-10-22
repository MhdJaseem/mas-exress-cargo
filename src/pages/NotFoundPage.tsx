import { Link } from 'react-router';
import { PageHero } from '../components/ui/PageHero';
import { Icon } from '../components/ui/Icon';
import { HashLink } from '../components/ui/HashLink';
import { pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/** Shown for any URL that has no route. */
export default function NotFoundPage() {
  useDocumentMeta(pageTitle('Page not found'), 'The page you are looking for could not be found.');

  return (
    <PageHero
      image="/img/hero/hero-sea.jpg"
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Page not found' }]}
      title={['Page ', 'not found']}
      lead="The page you are looking for doesn't exist or has moved."
    >
      <div className="btn-row">
        <Link className="btn brand" to="/">
          Back to home <Icon name="arrow" />
        </Link>
        <HashLink hash="contact" className="btn light">
          Contact Us
        </HashLink>
      </div>
    </PageHero>
  );
}
