import "./Profile.css"
import avatar from "../../assets/avatar.jpg";
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
                    <strong>hoangvudinh31@gmail.com</strong>
                </div>

                <div className="profile-row">
                    <span>SĐT:</span>
                    <strong>0987896905</strong>
                </div>
                <div className="profile-row">
                    <span>Github:</span>
                    <strong>link github</strong>
                </div>
                <div className="profile-row">
                    <span>Figma:</span>
                    <strong>link figma</strong>
                </div>
                <div className="profile-row">
                    <span>Báo cáo:</span>
                    <strong>link báo cáo</strong>
                </div>
                <div className="profile-row">
                    <span>Postman:</span>
                    <strong>link postman</strong>
                </div>
            </div>
        </div>
    )
}

export default Profile