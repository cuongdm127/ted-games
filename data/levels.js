// Dữ liệu màn chơi. Thêm hoặc sửa câu ở đây, không cần sửa code.
//
// Kiểu 'dem' (cho khủng long ăn):
//   soLuong   số lá phải cho ăn (đáp án)
//   soBo      số bó 10 lá có trên bãi cỏ
//   soLe      số lá lẻ có trên bãi cỏ
//   soMoiNhu  số khúc xương (mồi nhử, không được cho ăn)
// Kiểu 'timso' (chạm trứng):
//   soDung    số đúng; soLuaChon: các trứng hiện ra
//   phepTinh  (tuỳ chọn) phép tính hiện trên bảng, ví dụ '12 + 5'
// Kiểu 'sosanh' (Vùng 2): trai, phai: số trên hai bãi xe; chon: 'lon' (nhiều hơn) hoặc 'nho' (ít hơn)
// Kiểu 'chohang' (Vùng 2): xe: các số, mỗi xe chở thùng chục và thùng lẻ, bé kéo về kho đúng số
// Kiểu 'xepxe' (Vùng 2): so: các số trên xe đua, bé xếp từ nhỏ đến lớn
// hoi: chữ trong bong bóng của Rex; doc (tuỳ chọn): câu Rex đọc thành tiếng.

const dem = (soLuong, soBo, soLe, soMoiNhu = 0) => ({
  kieu: 'dem', soLuong, soBo, soLe, soMoiNhu, layout: 'rai-rac',
  hoi: `Cho khủng long ăn đúng ${soLuong} lá nhé!`,
});

const timSo = (soDung, soLuaChon) => ({
  kieu: 'timso', soDung, soLuaChon,
  hoi: `Chạm vào quả trứng số ${soDung} nhé!`,
});

const cong = (a, b, soLuaChon) => ({
  kieu: 'timso', soDung: a + b, soLuaChon, phepTinh: `${a} + ${b}`,
  hoi: `${a} + ${b} bằng mấy?`,
  doc: `${a} cộng ${b} bằng mấy?`,
});

const soSanh = (trai, phai, chon = 'lon') => ({
  kieu: 'sosanh', trai, phai, chon,
  hoi: `Bãi nào có ${chon === 'lon' ? 'nhiều' : 'ít'} xe hơn: ${trai} hay ${phai}?`,
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

export const LEVELS = {
  vung1: [
    {
      man: 1,
      tieuDe: 'Bãi trứng đầu tiên',
      cauChuyen: 'Khủng long cổ dài lớn lắm, ăn nhiều lá lắm! Mỗi bó có 10 lá đó, Ted ơi.',
      cau: [dem(13, 1, 4), dem(21, 2, 3), dem(30, 3, 2)],
    },
    {
      man: 2,
      tieuDe: 'Vườn lá rậm rạp',
      cauChuyen: '',
      cau: [dem(25, 3, 6), dem(34, 4, 6), dem(42, 5, 4)],
    },
    {
      man: 3,
      tieuDe: 'Những quả trứng số',
      cauChuyen: '',
      cau: [timSo(47, [47, 74, 41]), timSo(16, [61, 16, 60]), timSo(89, [98, 88, 89]), timSo(52, [25, 52, 50, 62])],
    },
    {
      man: 4,
      tieuDe: 'Khủng long cổ dài đói bụng',
      cauChuyen: '',
      cau: [cong(12, 5, [17, 16, 71]), cong(20, 30, [50, 5, 40]), dem(36, 4, 8), cong(23, 14, [37, 36, 47])],
    },
    {
      man: 5,
      tieuDe: 'Chợ trứng đông vui',
      cauChuyen: '',
      cau: [cong(31, 26, [57, 75, 56]), cong(42, 35, [77, 67, 78]), cong(54, 24, [78, 87, 68, 79]), cong(60, 25, [85, 58, 35, 86])],
    },
    {
      man: 6,
      tieuDe: 'Tiến sĩ Lộn Xộn bày bừa',
      cauChuyen: 'Ôi, giờ phải nhớ sang hàng chục rồi! Ted thử xem nào.',
      cau: [cong(18, 5, [23, 13, 22]), cong(27, 6, [33, 23, 32]), dem(45, 5, 7, 2), cong(15, 17, [32, 22, 31, 23]), cong(28, 14, [42, 32, 41, 52])],
    },
    {
      man: 7,
      tieuDe: 'Giúp Khủng long cổ dài dọn nhà',
      cauChuyen:
        'Tiến sĩ Lộn Xộn bày đồ lộn xộn khắp nhà Khủng long cổ dài. Ted giúp bạn ấy dọn dẹp và tìm lại Đá Năng Lượng nào!',
      cau: [dem(58, 6, 9, 2), cong(36, 27, [63, 53, 62, 73]), cong(45, 38, [83, 73, 82, 93]), cong(49, 26, [75, 65, 74, 85]), cong(57, 35, [92, 82, 91, 29])],
    },
  ],
  vung2: [
    {
      man: 1,
      tieuDe: 'Bãi đỗ xe',
      cauChuyen: 'Chào mừng Ted đến Thành Phố Xe! Tiến sĩ Lộn Xộn làm rối hết các bãi đỗ rồi.',
      cau: [soSanh(38, 52), soSanh(71, 17), soSanh(45, 54), soSanh(60, 59)],
    },
    {
      man: 2,
      tieuDe: 'Nhiều hay ít',
      cauChuyen: '',
      cau: [soSanh(83, 38, 'nho'), soSanh(29, 92, 'nho'), soSanh(66, 64), soSanh(70, 17, 'nho')],
    },
    {
      man: 3,
      tieuDe: 'Kho hàng',
      cauChuyen: 'Mỗi thùng cam có 10 món hàng, thùng vàng có 1 món. Ted đếm giúp nhé!',
      cau: [choHang(34, 43, 26), choHang(51, 15, 50)],
    },
    {
      man: 4,
      tieuDe: 'Đường đua',
      cauChuyen: '',
      cau: [xepXe(12, 27, 35, 58, 81), xepXe(40, 14, 44, 41)],
    },
    {
      man: 5,
      tieuDe: 'Ngã tư đông vui',
      cauChuyen: '',
      cau: [soSanh(67, 76, 'nho'), choHang(62, 26, 60), xepXe(19, 91, 29, 92)],
    },
    {
      man: 6,
      tieuDe: 'Tiến sĩ Lộn Xộn chặn đường',
      cauChuyen: 'Các số giống nhau quá, Ted nhìn thật kỹ nhé!',
      cau: [soSanh(88, 89), choHang(70, 7, 17), xepXe(33, 38, 83, 30, 80), soSanh(56, 65, 'nho')],
    },
    {
      man: 7,
      tieuDe: 'Cứu Khủng long ba sừng',
      cauChuyen: 'Khủng long ba sừng bị kẹt giữa đường đua! Ted dọn đường để tìm Đá Năng Lượng nào!',
      cau: [choHang(47, 74, 40), xepXe(15, 51, 55, 50, 5), soSanh(99, 90), choHang(38, 83, 33)],
    },
  ],
};
