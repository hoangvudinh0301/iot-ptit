
import "./Profile.css";
import avatar from "../../assets/hv.jpg";

function Profile() {
  return (
    <div className="profile">
      <div className="profile-avatar">
        <img src={avatar} alt="avatar" />
      </div>

      <div className="profile-info">
        <div className="profile-row">
          <span>Tên:</span>
          <strong>Đinh Hoàng Vũ</strong>
        </div>

        <div className="profile-row">
          <span>MSV:</span>
          <strong>B23DCCN941</strong>
        </div>

        <div className="profile-row">
          <span>Email:</span>
          <a href="mailto:hoangvudinh31@gmail.com">
            hoangvudinh31@gmail.com
          </a>
        </div>

        <div className="profile-row">
          <span>SĐT:</span>
          <a href="tel:0987896905">0987896905</a>
        </div>

        <div className="profile-row">
          <span>Github:</span>
          <a
            href="https://github.com/hoangvudinh0301"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="profile-row">
          <span>Figma:</span>
          <a
            href="https://www.figma.com/design/oRUgOUhWsGui9aXIvVqqqa/IoT?node-id=0-1&t=AgUfHCMgpqccAvgL-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem thiết kế Figma
          </a>
        </div>

        <div className="profile-row">
          <span>Báo cáo:</span>
          <a
            href="https://docs.google.com/document/d/1SLBxxPn2XsCs2zDFh5ThsTgrn7T9ARJhxd0fWU8Ol7s/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem báo cáo
          </a>
        </div>

        <div className="profile-row">
          <span>Postman:</span>
          <a
            href="https://hoangvudinh31-180751.postman.co/workspace/d5acf39e-7a77-4419-8d05-8be160f6eb7d/collection/52801227-b50b51d0-75f6-466d-896b-406ef021a5de?action=share&source=copy-link&creator=52801227"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem API Postman
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
