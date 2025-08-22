
const DocterSection = () => {
    return (
        <section id="doctors" className="doctors section">
        <div className="container section-title" data-aos="fade-up">
          <div className ="div_full"><div className="div_hht mb_30"></div></div>
          <div className="col-xs-12">
                <div className="div_flex mid">
                    <h2 className="w100 sz_32 sz_24mb cl_brandf item pt_5 mt_0 mb_0 pb_20" >
                        DANH MỤC BÁC SĨ                  </h2>
                    <u className="pull-right item mt_0 pb_20 pb_0mb mt_0mb last no_br cl_brands_4">
                        <a href="https://neovita.com.vn/doi-ngu-bac-si/" className="hidden-xs" ><strong>Xem tất cả</strong></a>   </u>
                </div>
                <hr className="soft-hr" />
            </div>
        </div>

        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div className="team-member d-flex align-items-start">
                <div className="pic">
                  <img
                    src="assets/img/doctors/doctors-1.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                
                
                <div className="member-info">
                  <h4>Walter White</h4>
                  <span><strong>Giám Đốc Y tế</strong></span>
                  <p>
                    "Giải thích rõ ràng, chuyên môn cao, luôn tận tâm trong công việc."
                  </p>
                  <div className="social">
                    <a href="">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="">
                      {' '}
                      <i className="bi bi-linkedin"></i>{' '}
                    </a>
                  </div>
                </div>
              </div>
              <hr className="item-hr d-lg-none" />
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="team-member d-flex align-items-start">
                <div className="pic">
                  <img
                    src="assets/img/doctors/doctors-2.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="member-info">
                  <h4>Sarah Jhonson</h4>
                  <span><strong>Bác sĩ gây mê</strong></span>
                  <p>
                    "Luôn đặt sự an toàn và thoải mái của bệnh nhân lên hàng đầu."
                  </p>
                  <div className="social">
                    <a href="">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="">
                      {' '}
                      <i className="bi bi-linkedin"></i>{' '}
                    </a>
                  </div>
                </div>
              </div>
               <hr className="item-hr d-lg-none" />
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div className="team-member d-flex align-items-start">
                <div className="pic">
                  <img
                    src="assets/img/doctors/doctors-3.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="member-info">
                  <h4>William Anderson</h4>
                  <span><strong>Bác sĩ tim mạch</strong></span>
                  <p>
                    "Tận tâm điều trị, đồng hành cùng bệnh nhân vượt qua khó khăn về tim mạch."
                  </p>
                  <div className="social">
                    <a href="">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="">
                      {' '}
                      <i className="bi bi-linkedin"></i>{' '}
                    </a>
                  </div>
                </div>
              </div>
              <hr className="item-hr d-lg-none" />
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
              <div className="team-member d-flex align-items-start">
                <div className="pic">
                  <img
                    src="assets/img/doctors/doctors-4.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="member-info">
                  <h4>Amanda Jepson</h4>
                  <span><strong>Bác sĩ phẫu thuật thần kinh</strong></span>
                  <p>
                    "Kinh nghiệm dày dặn, hết lòng vì sự sống của bệnh nhân."
                  </p>
                  <div className="social">
                    <a href="">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="">
                      {' '}
                      <i className="bi bi-linkedin"></i>{' '}
                    </a>
                  </div>
                </div>
              </div>
              <hr className="item-hr d-lg-none" />
            </div>
          </div>
        </div>
      </section>
    );
};

export default DocterSection;