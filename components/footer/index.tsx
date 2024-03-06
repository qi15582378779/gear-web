import { useRouter } from 'next/router';
import styled from 'styled-components';
const nav = [
  { name: 'Call', path: '/' },
  { name: 'Cells', path: '/cells' }
];

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <FooterFull>
      <div>
        {nav.map((ele) => (
          <NavItem key={ele.path} onClick={() => router.push(ele.path)} className={ele.path === router.pathname ? 'active' : ''}>
            {ele.name}
          </NavItem>
        ))}
      </div>
    </FooterFull>
  );
};

const FooterFull = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    padding: 0.08rem;
  }

  & > div {
    border-radius: 0.16rem;
    border: 1px solid #f1eaf0;
    height: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.44rem;
    background-color: #fff;
  }
`;

const NavItem = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 0.16rem;
  font-weight: 400;
  color: #7d7d7d;
  transition: all 0.2s;
  padding: 0 0.14rem;

  &.active,
  &:hover {
    color: #222;
    font-weight: 500;
  }
`;

export default Footer;
