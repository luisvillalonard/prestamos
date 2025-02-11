import { 
    EditOutlined, CheckOutlined, DownOutlined, UpOutlined, LockOutlined, MenuOutlined, MinusOutlined,
    BankOutlined, BellOutlined, LoadingOutlined, PlusOutlined,
    PoweroffOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import { IconType } from "react-icons"
import { AiOutlineUser, AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai"
import { BsSearch, BsTrash, BsPersonLinesFill, BsPersonVcard, BsListColumns, BsTags } from "react-icons/bs"
import { CiBarcode } from "react-icons/ci";
import { FaUserShield, FaRegMoneyBill1 } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { HiOutlineOfficeBuilding, HiOutlineClipboardList } from "react-icons/hi";
import { HiOutlineBuildingOffice2, HiOutlineCog6Tooth, HiOutlineUsers } from "react-icons/hi2";
import { ImListNumbered } from "react-icons/im";
import { IoMdTime } from "react-icons/io";
import { IoCloseOutline, IoTextOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { LiaFileInvoiceSolid, LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { PiTreeStructureThin, PiUsersThreeLight, PiPackageLight, PiUserList } from "react-icons/pi";
import { RiProductHuntLine, RiProfileLine } from "react-icons/ri";
import { SlUserUnfollow, SlUserFollowing,SlBookOpen } from "react-icons/sl";
import { TbRuler3, TbRulerMeasure, TbInvoice } from "react-icons/tb";

export function useIconos() {

    const IconAccountFinance: IconType = BsListColumns;
    const IconArrowDown = DownOutlined;
    const IconArrowUp = UpOutlined;
    const IconAlert = BellOutlined;
    const IconBank = BankOutlined;
    const IconBankAccount: IconType = ImListNumbered;
    const IconBarcode: IconType = CiBarcode;
    const IconBookOpen: IconType = SlBookOpen;
    const IconBuy: IconType = TbInvoice;
    const IconBuyType: IconType = HiOutlineClipboardList;
    const IconCheck = CheckOutlined;
    const IconChecklist: IconType = GoChecklist;
    const IconClose = IoCloseOutline; //AiOutlineClose
    const IconCompany: IconType = HiOutlineBuildingOffice2;
    const IconConfig: IconType = HiOutlineCog6Tooth;
    const IconClient: IconType = PiUserList;
    const IconEdit = EditOutlined;
    const IconInvoice: IconType = LiaFileInvoiceSolid;
    const IconInvoicePay: IconType = LiaFileInvoiceDollarSolid;
    const IconLoading = LoadingOutlined;
    const IconLock = LockOutlined;
    const IconLogout = PoweroffOutlined;
    const IconMeasure: IconType = TbRulerMeasure;
    const IconMeasureUnit: IconType = TbRuler3;
    const IconMenu = MenuOutlined; //IoMenuOutline;
    const IconMinus = MinusOutlined;
    const IconMoney: IconType = FaRegMoneyBill1;
    const IconPackage: IconType = PiPackageLight;
    const IconPayMoney: IconType = GiPayMoney;
    const IconPlus = PlusOutlined;
    const IconPosition: IconType = PiTreeStructureThin;
    const IconProducts: IconType = RiProductHuntLine;
    const IconReceiveMoney: IconType = GiReceiveMoney;
    const IconSearch: IconType = BsSearch;
    const IconShoppingCart = ShoppingCartOutlined;
    const IconSuppliers: IconType = BsPersonLinesFill;
    const IconStore: IconType = HiOutlineOfficeBuilding;
    const IconTags: IconType = BsTags;
    const IconText: IconType = IoTextOutline;
    const IconTime: IconType = IoMdTime;
    const IconTrash: IconType = BsTrash;
    const IconUser: IconType = AiOutlineUser;
    const IconUserAdd: IconType = AiOutlineUserAdd;
    const IconUserBad: IconType = SlUserUnfollow;
    const IconUserDelete: IconType = AiOutlineUserDelete;
    const IconUserGood: IconType = SlUserFollowing;
    const IconUserGroup: IconType = PiUsersThreeLight;
    const IconUserProfile: IconType = BsPersonVcard;
    const IconUserPermission: IconType = IoShieldCheckmarkOutline;
    const IconUsers: IconType = HiOutlineUsers;
    const IconUserShield: IconType = FaUserShield;
    const IconVoucher: IconType = RiProfileLine;

    return {
        IconAccountFinance,
        IconArrowDown,
        IconArrowUp,
        IconAlert,
        IconBank,
        IconBankAccount,
        IconBarcode,
        IconBookOpen,
        IconBuy,
        IconBuyType,
        IconCheck,
        IconChecklist,
        IconClose,
        IconCompany,
        IconConfig,
        IconClient,
        IconEdit,
        IconInvoice,
        IconInvoicePay,
        IconLoading,
        IconLock,
        IconLogout,
        IconMeasure,
        IconMeasureUnit,
        IconMenu,
        IconMinus,
        IconMoney,
        IconPackage,
        IconPayMoney,
        IconPlus,
        IconPosition,
        IconProducts,
        IconReceiveMoney,
        IconSearch,
        IconShoppingCart,
        IconSuppliers,
        IconStore,
        IconTags,
        IconText,
        IconTime,
        IconTrash,
        IconUser,
        IconUserAdd,
        IconUserBad,
        IconUserDelete,
        IconUserGood,
        IconUserGroup,
        IconUserProfile,
        IconUserPermission,
        IconUsers,
        IconUserShield,
        IconVoucher,
    }

}