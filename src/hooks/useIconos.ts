import {
    EditOutlined,
    LoadingOutlined,
    LockOutlined, MenuOutlined,
    PoweroffOutlined,
} from "@ant-design/icons"
import { IconType } from "react-icons"
import { AiOutlineUser } from "react-icons/ai"
import { BsPersonVcard, BsSearch } from "react-icons/bs"
import { CiViewList } from "react-icons/ci"
import { FaRegAddressCard, FaUserShield } from "react-icons/fa6"
import { GiReceiveMoney } from "react-icons/gi"
import { GoChecklist } from "react-icons/go"
import { HiOutlineCog6Tooth, HiOutlineUsers } from "react-icons/hi2"
import { IoShieldCheckmarkOutline } from "react-icons/io5"
import { LuCalculator } from "react-icons/lu"
import { MdOutlineFormatListNumbered, MdOutlinePassword } from "react-icons/md"

export function useIconos() {

    const IconCalculator = LuCalculator;
    const IconChecklist = GoChecklist;
    const IconClient = FaRegAddressCard;
    const IconConfig = HiOutlineCog6Tooth;
    const IconEdit = EditOutlined;
    const IconForm = CiViewList;
    const IconListNumbered = MdOutlineFormatListNumbered;
    const IconLoading = LoadingOutlined;
    const IconLock = LockOutlined;
    const IconMenu = MenuOutlined;
    const IconLogout = PoweroffOutlined;
    const IconPassword = MdOutlinePassword;
    const IconReceiveMoney = GiReceiveMoney;
    const IconSearch = BsSearch;
    const IconUserProfile = BsPersonVcard;
    const IconUserPermission = IoShieldCheckmarkOutline;
    const IconUser: IconType = AiOutlineUser;
    const IconUsers = HiOutlineUsers;
    const IconUserShield = FaUserShield;

    /* const IconAccountFinance: IconType = BsListColumns;
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
    const IconClose = IoCloseOutline; //AiOutlineClose
    const IconCompany: IconType = HiOutlineBuildingOffice2;
    const IconInvoice: IconType = LiaFileInvoiceSolid;
    const IconInvoicePay: IconType = LiaFileInvoiceDollarSolid;
    const IconMeasure: IconType = TbRulerMeasure;
    const IconMeasureUnit: IconType = TbRuler3; //IoMenuOutline;
    const IconMinus = MinusOutlined;
    const IconMoney: IconType = FaRegMoneyBill1;
    const IconPackage: IconType = PiPackageLight;
    const IconPayMoney: IconType = GiPayMoney;
    const IconPlus = PlusOutlined;
    const IconPosition: IconType = PiTreeStructureThin;
    const IconProducts: IconType = RiProductHuntLine;
    const IconShoppingCart = ShoppingCartOutlined;
    const IconSuppliers: IconType = BsPersonLinesFill;
    const IconStore: IconType = HiOutlineOfficeBuilding;
    const IconTags: IconType = BsTags;
    const IconText: IconType = IoTextOutline;
    const IconTime: IconType = IoMdTime;
    const IconTrash: IconType = BsTrash;
    const IconUserAdd: IconType = AiOutlineUserAdd;
    const IconUserBad: IconType = SlUserUnfollow;
    const IconUserDelete: IconType = AiOutlineUserDelete;
    const IconUserGood: IconType = SlUserFollowing;
    const IconUserGroup: IconType = PiUsersThreeLight;
    const IconVoucher: IconType = RiProfileLine; */

    return {
        IconCalculator,
        IconChecklist,
        IconClient,
        IconConfig,
        IconEdit,
        IconForm,
        IconListNumbered,
        IconLoading,
        IconLock,
        IconLogout,
        IconPassword,
        IconMenu,
        IconReceiveMoney,
        IconSearch,
        IconUserProfile,
        IconUserPermission,
        IconUser,
        IconUsers,
        IconUserShield,

        /* IconAccountFinance,
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
        IconInvoice,
        IconInvoicePay,
        IconMeasure,
        IconMeasureUnit,
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
        IconUserAdd,
        IconUserBad,
        IconUserDelete,
        IconUserGood,
        IconUserGroup,
        IconVoucher, */
    }

}