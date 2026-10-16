// Dữ liệu màn chơi. Thêm hoặc sửa câu ở đây, không cần sửa code.
//
// Kiểu 'dem' (cho khủng long ăn):
//   soLuong   số lá phải cho ăn (đáp án)
//   soBo      số bó 10 lá có trên bãi cỏ
//   soLe      số lá lẻ có trên bãi cỏ
//   soMoiNhu  số khúc xương (mồi nhử, không được cho ăn)
// Kiểu 'goibo' (gói bó): soBo bó phải gói, soLa lá lẻ trên bãi; Ted đặt lá vào khung 10 ô.
// Kiểu 'timso' (chạm trứng):
//   soDung    số đúng; soLuaChon: các trứng hiện ra
//   phepTinh  (tuỳ chọn) phép tính hiện trên bảng, ví dụ '3 + 5'; hinh: true để vẽ chấm trong khung 10 ô
// Kiểu 'sosanh' (Vùng 2): trai, phai: số trên hai bãi xe; chon: 'lon' (nhiều hơn), 'nho' (ít hơn) hoặc 'dau' (chọn dấu <, =, >)
// Kiểu 'chohang' (Vùng 2): xe: các số, mỗi xe chở thùng chục và thùng lẻ, bé kéo về kho đúng số
// Kiểu 'xepxe' (Vùng 2): so: các số trên xe đua, bé xếp từ nhỏ đến lớn
// ngoaiDoi (mỗi màn): việc nhỏ Ted làm cùng bố mẹ ngoài đời, hiện ở màn xong màn.
// hoi: chữ trong bong bóng của Rex; doc (tuỳ chọn): câu Rex đọc thành tiếng.

export const dem = (soLuong, soBo, soLe, soMoiNhu = 0) => ({
  kieu: 'dem', soLuong, soBo, soLe, soMoiNhu, layout: 'rai-rac',
  hoi: `Cho khủng long ăn đúng ${soLuong} lá nhé!`,
});

export const timSo = (soDung, soLuaChon) => ({
  kieu: 'timso', soDung, soLuaChon,
  hoi: `Chạm vào quả trứng số ${soDung} nhé!`,
});

export const cong = (a, b, soLuaChon) => ({
  kieu: 'timso', soDung: a + b, soLuaChon, phepTinh: `${a} + ${b}`,
  hoi: `${a} + ${b} bằng mấy?`,
  doc: `${a} cộng ${b} bằng mấy?`,
});

// Phép cộng có chấm trong khung 10 ô để Ted đếm được.
export const congHinh = (a, b, soLuaChon) => ({ ...cong(a, b, soLuaChon), hinh: true });

// Gói lá lẻ thành bó 10: soBo bó phải gói, soLa lá có trên bãi.
const goiBo = (soBo, soLa) => ({
  kieu: 'goibo', soBo, soLa,
  hoi: soBo === 1 ? 'Gói 10 lá thành 1 bó nhé!' : `Gói ${soBo} bó lá nhé!`,
  doc: soBo === 1 ? 'Ted đặt từng lá vào khung. Đủ 10 lá là gói được 1 bó!' : `Gói ${soBo} bó lá nhé! Mỗi bó 10 lá.`,
});

export const soSanh = (trai, phai, chon = 'lon') => ({
  kieu: 'sosanh', trai, phai, chon,
  hoi: `Bãi nào có ${chon === 'lon' ? 'nhiều' : 'ít'} xe hơn: ${trai} hay ${phai}?`,
});

// Chọn dấu <, =, > đặt giữa hai bãi xe.
export const chonDau = (trai, phai) => ({
  kieu: 'sosanh', trai, phai, chon: 'dau',
  hoi: `Chọn dấu đúng: ${trai} ? ${phai}`,
  doc: `${trai} với ${phai}. Ted chọn dấu nào nhỉ?`,
});

const choHang = (...xe) => ({
  kieu: 'chohang', xe,
  hoi: 'Chở mỗi xe hàng về kho có số đúng nhé!',
  doc: 'Thùng cam là 10, thùng vàng là 1. Chở mỗi xe về kho có số đúng nhé!',
});

const xepXe = (...so) => ({
  kieu: 'xepxe', so,
  hoi: 'Xếp xe từ số nhỏ đến số lớn nhé!',
});

// Thứ tự bài theo lộ trình học: mỗi màn chỉ thêm một điều mới, màn cuối ôn lại.
export const LEVELS = {
  vung1: [
    {
      man: 1,
      ngoaiDoi: 'Ted đếm xem nhà mình có bao nhiêu đôi dép, rồi kể cho bố mẹ nghe nhé!',
      tieuDe: 'Bãi trứng đầu tiên',
      cauChuyen: 'Khủng long cổ dài đói lắm! Ted đếm lá cho bạn ấy ăn nhé.',
      cau: [dem(12, 0, 15), dem(16, 0, 19), dem(20, 0, 22, 1)],
    },
    {
      man: 2,
      ngoaiDoi: 'Cùng bố mẹ gom 10 món đồ chơi lại thành một bó nhé!',
      tieuDe: 'Gói lá thành bó',
      cauChuyen: 'Lá nhiều quá, đếm mỏi tay! Mình gói 10 lá thành 1 bó cho dễ đếm nhé.',
      cau: [goiBo(1, 13), goiBo(2, 24), dem(13, 1, 6)],
    },
    {
      man: 3,
      ngoaiDoi: 'Cùng bố mẹ đếm bậc cầu thang. Cứ 10 bậc là 1 chục đó!',
      tieuDe: 'Vườn lá rậm rạp',
      cauChuyen: 'Mỗi bó có 10 lá. Ted đếm bó trước, rồi đếm lá lẻ nhé!',
      cau: [dem(23, 2, 6), dem(31, 3, 4), dem(45, 4, 8), dem(50, 5, 3)],
    },
    {
      man: 4,
      ngoaiDoi: 'Tìm một số có hai chữ số trên lịch hoặc biển số xe, đọc cho bố mẹ nghe nhé!',
      tieuDe: 'Những quả trứng số',
      cauChuyen: '',
      cau: [timSo(47, [47, 74, 41]), timSo(16, [61, 16, 60]), timSo(89, [98, 88, 89]), timSo(52, [25, 52, 50, 62])],
    },
    {
      man: 5,
      ngoaiDoi: 'Lấy 3 cái kẹo, thêm 2 cái nữa. Ted đếm xem có tất cả mấy cái?',
      tieuDe: 'Trứng nở thêm',
      cauChuyen: 'Trứng màu cam và trứng màu xanh. Ted đếm hết các chấm để cộng nhé!',
      cau: [congHinh(3, 1, [4, 3, 5]), congHinh(5, 2, [7, 6, 8]), congHinh(6, 1, [7, 8, 6]), congHinh(7, 2, [9, 8, 10])],
    },
    {
      man: 6,
      ngoaiDoi: 'Xoè hai bàn tay ra: có đúng 10 ngón! Đố bố mẹ: 8 cộng mấy thì bằng 10?',
      tieuDe: 'Gộp cho đủ 10',
      cauChuyen: 'Khung có 10 ô. Ô nào cũng đầy là đủ 10 rồi đó!',
      cau: [congHinh(4, 4, [8, 7, 9]), congHinh(4, 5, [9, 8, 10]), congHinh(8, 2, [10, 9, 11]), congHinh(9, 3, [12, 11, 13]), congHinh(8, 5, [13, 12, 14])],
    },
    {
      man: 7,
      ngoaiDoi: 'Kể cho bố mẹ nghe Ted đã giúp khủng long cổ dài thế nào nhé!',
      tieuDe: 'Giúp Khủng long cổ dài dọn nhà',
      cauChuyen:
        'Tiến sĩ Lộn Xộn bày đồ lộn xộn khắp nhà Khủng long cổ dài. Ted giúp bạn ấy dọn dẹp và tìm lại Đá Năng Lượng nào!',
      cau: [dem(36, 4, 8, 2), timSo(62, [26, 62, 60]), cong(6, 6, [12, 11, 13]), congHinh(7, 5, [12, 11, 13, 21]), cong(9, 7, [16, 15, 17, 61])],
    },
  ],
  vung2: [
    {
      man: 1,
      ngoaiDoi: 'Khi ra đường, Ted xem bên nào có nhiều xe máy hơn nhé!',
      tieuDe: 'Bãi đỗ xe',
      cauChuyen: 'Chào mừng Ted đến Thành Phố Xe! Tiến sĩ Lộn Xộn làm rối hết các bãi đỗ rồi.',
      cau: [soSanh(12, 17), soSanh(19, 14), soSanh(8, 15), soSanh(16, 11)],
    },
    {
      man: 2,
      ngoaiDoi: 'Ai có nhiều ô tô đồ chơi hơn: Ted hay bố? Cùng đếm thử xem!',
      tieuDe: 'Nhiều hay ít',
      cauChuyen: '',
      cau: [soSanh(13, 18, 'nho'), soSanh(20, 12), soSanh(25, 19, 'nho'), soSanh(14, 24)],
    },
    {
      man: 3,
      ngoaiDoi: 'Vẽ miệng khủng long lên giấy rồi đố bố mẹ: 12 và 21, miệng há về bên nào?',
      tieuDe: 'Miệng khủng long',
      cauChuyen: 'Dấu so sánh giống miệng khủng long: miệng luôn há về phía số lớn hơn!',
      cau: [soSanh(18, 13), soSanh(21, 12, 'nho'), soSanh(17, 27), chonDau(12, 21), chonDau(15, 15), chonDau(24, 19)],
    },
    {
      man: 4,
      ngoaiDoi: 'Xếp đồ chơi thành từng nhóm 10 cái, rồi đếm xem có mấy chục nhé!',
      tieuDe: 'Kho hàng',
      cauChuyen: 'Thùng cam có 10 món hàng, giống 1 bó lá đó. Thùng vàng có 1 món. Ted đếm giúp nhé!',
      cau: [choHang(13, 31, 20), choHang(34, 43, 26)],
    },
    {
      man: 5,
      ngoaiDoi: 'Đố bố mẹ: 45 và 54, số nào lớn hơn?',
      tieuDe: 'Ngã tư đông vui',
      cauChuyen: 'Số càng nhiều chục thì càng lớn. Ted nhìn hàng chục trước nhé!',
      cau: [chonDau(38, 52), soSanh(71, 17), chonDau(45, 54), soSanh(83, 38, 'nho'), chonDau(60, 59)],
    },
    {
      man: 6,
      ngoaiDoi: 'Xếp đồ chơi của Ted từ nhỏ đến lớn nhé!',
      tieuDe: 'Đường đua',
      cauChuyen: '',
      cau: [xepXe(12, 35, 81), xepXe(40, 14, 27), xepXe(19, 91, 55, 30)],
    },
    {
      man: 7,
      ngoaiDoi: 'Kể cho bố mẹ nghe Ted đã cứu khủng long ba sừng thế nào nhé!',
      tieuDe: 'Cứu Khủng long ba sừng',
      cauChuyen: 'Khủng long ba sừng bị kẹt giữa đường đua! Ted dọn đường để tìm Đá Năng Lượng nào!',
      cau: [chonDau(56, 59), soSanh(88, 89), choHang(47, 74, 40), xepXe(33, 38, 83, 30), chonDau(99, 90)],
    },
  ],
};
