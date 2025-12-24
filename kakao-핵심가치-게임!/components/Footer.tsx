
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-kakao-black border-t border-gray-100 dark:border-gray-900 pt-20 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
          <div className="col-span-1 md:col-span-1">
            <span className="font-black text-2xl tracking-tighter text-kakao-brown dark:text-kakao-yellow mb-6 block">KAKAO</span>
            <p className="text-gray-500 text-sm leading-relaxed">
              제주특별자치도 제주시 첨단로 242<br/>
              (주)카카오
            </p>
          </div>
          <div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-kakao-yellow transition-colors">카카오 문화</a></li>
              <li><a href="#" className="hover:text-kakao-yellow transition-colors">공동체 소개</a></li>
              <li><a href="#" className="hover:text-kakao-yellow transition-colors">히스토리</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-4">Careers</h5>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-kakao-yellow transition-colors">영입소식</a></li>
              <li><a href="#" className="hover:text-kakao-yellow transition-colors">지원하기</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-kakao-yellow hover:text-kakao-brown transition-all hoverable">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-kakao-yellow hover:text-kakao-brown transition-all hoverable">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-kakao-yellow hover:text-kakao-brown transition-all hoverable">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <img 
          src="https://mblogthumb-phinf.pstatic.net/MjAyNTAyMjdfMzgg/MDAxNzQwNjUxMTYxNjUx.DwwOMpvR0fQyKjsF8CuRcOmOIMQJU_z3lvQ8uE9FqLkg.oerRcQUe3q8bFYLyjHwj7ZdNYktIaj1sVZ27s1oTJRIg.PNG/1739778769788.png?type=w400" 
          alt="Characters" 
          className="absolute -right-10 bottom-0 w-64 h-auto opacity-40 dark:opacity-20 hidden md:block"
        />

        <div className="border-t border-gray-100 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 relative z-10">
          <p>© Kakao Corp. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">이용약관</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white font-bold">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
