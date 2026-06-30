import { git } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/git'>) {
    return (
    <DocsLayout tree={git.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
