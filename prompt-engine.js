const $=id=>document.getElementById(id);
const platforms={general:"Đa nền tảng",chatgpt:"ChatGPT: phân tích ảnh, dùng công cụ chạy mã nếu có",gemini:"Gemini: phân tích ảnh và đặc tả hình học",claude:"Claude: tạo đặc tả và mã Blender",blender:"Blender: xuất script Python bpy có thể chạy",meshy:"Meshy: Image to 3D, kiểm tra tệp sau xuất",tripo:"Tripo: Image to 3D, kiểm tra tệp sau xuất"};
const directions={perspective:"Ảnh phối cảnh, hướng chưa xác nhận",front:"FRONT nhìn theo -Z",back:"BACK nhìn theo +Z",top:"TOP nhìn theo -Y",bottom:"BOTTOM nhìn theo +Y",left:"LEFT nhìn theo +X",right:"RIGHT nhìn theo -X"};
document.getElementById('generate').onclick=()=>{
const val=id=>$(id).value;const refs=window.HGReferenceGallery?.getReferences()||[];const referenceList=refs.length?refs.map(r=>r.index+". "+r.name+" — "+(directions[r.view]||"Ảnh chi tiết / vật liệu, không phải hướng chiếu chuẩn")).join("\\n"):"CHƯA TẢI ẢNH — phải đính kèm ảnh nguồn khi gửi prompt";const lines=[
"HOANGGIA FURNITURE 3D AI — KHÓA TRỤC VÀ TÁI DỰNG 3D",
"NỀN TẢNG: "+platforms[val('platform')],"SẢN PHẨM: "+val('kind'),"ĐỘ CHI TIẾT: "+val('lod'),
"KÍCH THƯỚC XÁC NHẬN (mm): Dài = "+(val("dimLength").trim()||"CHƯA XÁC NHẬN")+"; Rộng/Sâu = "+(val("dimWidth").trim()||"CHƯA XÁC NHẬN")+"; Cao = "+(val("dimHeight").trim()||"CHƯA XÁC NHẬN"),
"ẢNH QUY CHIẾU MẶC ĐỊNH: "+directions[val('refview')],"DANH SÁCH ẢNH THAM CHIẾU ("+refs.length+" ảnh):\\n"+referenceList,"YÊU CẦU RIÊNG: "+(val('notes').trim()||"Theo ảnh nguồn"),"ĐỊNH DẠNG: "+val('format'),
"",
"1. BỐI CẢNH",
"Tôi là kiến trúc sư nội thất. Tái dựng mô hình 3D từ ảnh và bản vẽ thực sự được đính kèm. Nếu không thấy ảnh phải yêu cầu tải lại. Giữ hình dáng, tỷ lệ, vật liệu và tư thế sử dụng của sản phẩm.",
"",
"2. VAI TRÒ",
"Bạn là nhóm chuyên gia dựng Furniture 3D, CAD, topology, PBR, UV, Blender/3ds Max, kiểm định mesh, kỹ thuật sản xuất và chuyên gia khóa hệ tọa độ 3D.",
"",
"3. NHIỆM VỤ",
"Bước 1 — Phân tích TẤT CẢ ảnh tham chiếu theo tên và hướng đã gán; đối chiếu các ảnh của CÙNG MỘT SẢN PHẨM, không trộn đặc điểm của sản phẩm khác. Xác định mặt trên, dưới, trước, sau, trái, phải; phân biệt ảnh phối cảnh với hình chiếu. Nếu nhãn hướng mâu thuẫn với hình ảnh, phải báo để xác minh. Phân loại XÁC NHẬN / SUY LUẬN / CẦN XÁC NHẬN.",
"Bước 2 — Khóa trục: X dương sang phải khi nhìn mặt trước, Y dương hướng lên, Z dương hướng về mặt trước. Sàn XZ luôn Y=0 (cốt ±0.000). TOP nhìn -Y; BOTTOM nhìn +Y; FRONT nhìn -Z; BACK nhìn +Z; LEFT nhìn +X; RIGHT nhìn -X. Chỉ xác nhận hướng khi có bằng chứng. Không đảo các hướng sau khi khóa.",
"Bước 3 — Dựng mesh: dựng đúng đường cong, độ dày, cấu trúc; tách bộ phận hợp lý. Với bàn, mặt bàn ở phía trên, nằm ngang song song XZ, chân hướng xuống và tiếp xúc sàn Y=0. Với ghế/sofa/tủ/giường, xác định tư thế sử dụng và chân/đế chạm sàn. Không xoay camera hoặc lưới để che sai hướng. Nếu tệp nguồn Z-up, chuyển chính xác sang Y-up trước khi xuất.",
"Bước 4 — Hoàn thiện và đối chiếu: kiểm tra topology, normals, UV, vật liệu PBR, kích thước và quan hệ các bộ phận. Sáu hình chiếu phải cùng một hệ hình học. PHẢI lập bảng nhận diện từng bộ phận theo ảnh: silhouette/đường bao, hình dạng 3D, độ cong, độ dày, vị trí nối, tỷ lệ, màu, texture và phụ kiện. So sánh ảnh tham chiếu với ảnh render mô hình từ camera tương ứng; chỉ chỉnh mô hình, không bóp méo camera để che lỗi. Giữ đường nét thiết kế đặc trưng thay vì dùng hình khối mặc định.",
"Bước 5 — Kiểm định và xuất: tạo ảnh kiểm chứng cùng góc nhìn tham chiếu; kiểm tra độ khớp đường bao tổng thể, tỷ lệ lưng/mặt ngồi/chân, vị trí tiếp giáp, độ cong, chiều dày, số lượng chân, đầu chân, chi tiết trang trí, màu và texture. Nếu khác rõ rệt phải báo các sai khác và yêu cầu sửa trước khi kết luận hoàn thành. Không được tự tuyên bố giống 100% từ một ảnh. Kiểm tra bounding box, mặt trên, chân/đế tại Y=0, các hướng và vật liệu. Xuất GLB, OBJ+MTL, FBX khi công cụ hỗ trợ và nhập lại để kiểm tra. Nếu không có khả năng tạo mesh, cung cấp mã Blender Python có thể thực thi, không giả vờ đã tạo file.",
"",
"4. RÀNG BUỘC",
"KHÓA THIẾT KẾ THAM CHIẾU: không thay thế ghế/bàn bằng mẫu chung cùng loại; không bỏ phụ kiện, không làm mỏng đệm/lưng, không thay số chân hoặc góc chân, không thêm khoảng hở không có trong ảnh. Nếu có ảnh phối cảnh duy nhất, độ sâu khuất phải gắn nhãn SUY LUẬN. Không thay đổi thiết kế, không bịa phần khuất hoặc kích thước. Không đảo TOP/BOTTOM, LEFT/RIGHT, FRONT/BACK. Không để mô hình xuyên sàn hoặc lơ lửng. Không dịch lưới sàn theo mô hình. Ưu tiên chính xác hình học. Không tuyên bố xuất file nếu chưa xuất và xác minh.",
"",
"5. KẾT QUẢ ĐẦU RA",
"Phân tích nguồn; bảng đối chiếu từng bộ phận với ảnh gốc và danh sách sai khác cần sửa; bảng kích thước; bảng xác minh 6 hướng; mô hình hoặc mã dựng; góc TOP/BOTTOM/FRONT/BACK/LEFT/RIGHT/PERSPECTIVE; báo cáo cốt sàn Y=0 và topology; file 3D thực nếu đã xuất và kiểm tra.",
"",
"YÊU CẦU CUỐI: khóa trục từ bằng chứng ảnh, mặt trên đúng hướng, chân chạm cốt 0; thiếu bằng chứng thì yêu cầu ảnh bổ sung."
];$('output').value=lines.join('\n');$('status').textContent='Đã tạo prompt 5 mục cho '+$('platform').selectedOptions[0].text+'. Hãy gửi ảnh nguồn cùng prompt tới nền tảng đã chọn.';};
